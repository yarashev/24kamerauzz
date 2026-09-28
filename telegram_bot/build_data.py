"""Прайс (xlsx) -> webapp/products.json. Запуск: python build_data.py price.xlsx"""
import io, json, os, re, sys, hashlib, openpyxl
from PIL import Image

ICON=72  # px, квадратная иконка webp

def num(v):
    if isinstance(v, (int, float)): return float(v)
    try: return float(str(v).replace(",", ".").replace(" ", ""))
    except Exception: return None

def icon(data, dst):
    im = Image.open(io.BytesIO(data)).convert("RGBA")
    im.thumbnail((ICON, ICON), Image.LANCZOS)
    bg = Image.new("RGBA", (ICON, ICON), (255, 255, 255, 255))
    bg.paste(im, ((ICON - im.width) // 2, (ICON - im.height) // 2), im)
    bg.convert("RGB").save(dst, "WEBP", quality=55, method=6)

def build(xlsx, out="webapp/products.json", icons="webapp/icons"):
    wb = openpyxl.load_workbook(xlsx, data_only=False)
    os.makedirs(icons, exist_ok=True)
    items, seen, cache = [], set(), {}
    for ws in wb:
        cat, sec = ws.title.strip(), ""
        if cat == "Короткий прайс": continue
        start = 4 if cat == "БЕЗ СКИДОК" else 2
        pics = {}
        for im in ws._images:
            try: pics[im.anchor._from.row + 1] = im._data()
            except Exception: pass
        for r in range(start, ws.max_row + 1):
            a, b, c, e = (ws.cell(r, i).value for i in (1, 2, 3, 5))
            if b is None and isinstance(a, str) and a.strip():
                sec = a.strip(); continue
            p = num(c)
            if not b or p is None or p <= 0: continue
            name = re.sub(r"\s+", " ", str(b)).strip()
            seen.add(name.lower())
            d = re.sub(r"\s+", " ", str(e)).strip()[:220] if e and cat != "БЕЗ СКИДОК" else ""
            it = {"n": name, "p": round(p, 2), "c": cat, "s": sec, "d": d}
            if r in pics:
                h = hashlib.md5(pics[r]).hexdigest()[:10]
                if h not in cache:
                    try: icon(pics[r], f"{icons}/{h}.webp"); cache[h] = 1
                    except Exception: cache[h] = 0
                if cache[h]: it["i"] = h
            items.append(it)
    if "Короткий прайс" in wb.sheetnames:
        ws = wb["Короткий прайс"]
        for r in range(2, ws.max_row + 1):
            name, p = ws.cell(r, 1).value, num(ws.cell(r, 2).value)
            if name and p and str(name).strip().lower() not in seen:
                items.append({"n": str(name).strip(), "p": round(p, 2), "c": "Прочее", "s": "", "d": ""})
    json.dump(items, open(out, "w", encoding="utf8"), ensure_ascii=False, separators=(",", ":"))
    return len(items)

if __name__ == "__main__":
    print(build(sys.argv[1] if len(sys.argv) > 1 else "price.xlsx"), "товаров")
