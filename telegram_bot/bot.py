import asyncio, os, logging
from aiohttp import web
from aiogram import Bot, Dispatcher, F
from aiogram.filters import CommandStart, Command
from aiogram.types import (Message, WebAppInfo, InlineKeyboardMarkup, InlineKeyboardButton,
                           MenuButtonWebApp, FSInputFile)
import json
from build_data import build

TOKEN = os.environ["BOT_TOKEN"]
ADMIN_ID = int(os.environ["ADMIN_ID"])          # ваш Telegram ID (заявки + загрузка прайса)
BASE_URL = os.environ["BASE_URL"].rstrip("/")   # https://ваш-домен (HTTPS обязателен)
PORT = int(os.getenv("PORT", 8080))
RATE = int(os.getenv("RATE", 12500))
logging.basicConfig(level=logging.INFO)
bot, dp = Bot(TOKEN), Dispatcher()

def kb():
    return InlineKeyboardMarkup(inline_keyboard=[[InlineKeyboardButton(
        text="🛍 Открыть каталог", web_app=WebAppInfo(url=BASE_URL + "/"))]])

@dp.message(CommandStart())
async def start(m: Message):
    await m.answer("👋 Добро пожаловать в <b>KSS</b>!\nВидеонаблюдение, сети, охрана и пожарная безопасность — "
                   "актуальные цены, поиск и заказ в пару касаний.", parse_mode="HTML", reply_markup=kb())

@dp.message(Command("price"))
async def price(m: Message):
    if os.path.exists("price.xlsx"):
        await m.answer_document(FSInputFile("price.xlsx"), caption="📄 Актуальный прайс-лист")
    else:
        await m.answer("Прайс пока не загружен.")

@dp.message(F.web_app_data)
async def order(m: Message):
    o = json.loads(m.web_app_data.data)
    lines = "\n".join(f"• {i['n']} × {i['q']} = ${i['p']*i['q']:,.2f}" for i in o["items"])
    txt = (f"🆕 <b>Новая заявка</b>\n👤 {o['name'] or m.from_user.full_name} "
           f"(@{m.from_user.username or '—'})\n📞 {o['phone']}\n\n{lines}\n\n"
           f"💰 <b>${o['total']:,.2f}</b> ≈ {round(o['total']*RATE):,} сум".replace(",", " "))
    await bot.send_message(ADMIN_ID, txt, parse_mode="HTML")
    await m.answer("✅ Заявка отправлена! Мы скоро свяжемся с вами.")

@dp.message(F.document & (F.from_user.id == ADMIN_ID))
async def upload(m: Message):        # админ шлёт новый xlsx -> каталог обновляется сам
    if not m.document.file_name.lower().endswith(".xlsx"):
        return await m.answer("Отправьте файл .xlsx")
    await bot.download(m.document, destination="price.xlsx")
    await m.answer(f"✅ Каталог обновлён: {build('price.xlsx')} товаров")

async def main():
    app = web.Application()
    app.router.add_get("/", lambda r: web.FileResponse("webapp/index.html"))
    app.router.add_static("/", "webapp", show_index=False)
    runner = web.AppRunner(app); await runner.setup()
    await web.TCPSite(runner, "0.0.0.0", PORT).start()
    await bot.set_chat_menu_button(menu_button=MenuButtonWebApp(text="Каталог", web_app=WebAppInfo(url=BASE_URL + "/")))
    await dp.start_polling(bot)

asyncio.run(main())
