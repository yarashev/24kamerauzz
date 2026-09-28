# KSS — Telegram bot + Mini App (контекст для Cursor AI)

Стек: Python 3.12, aiogram 3, aiohttp, openpyxl, Pillow. Фронтенд — один файл без сборки.

## Файлы
- `bot.py` — бот (/start, /price, приём заявок web_app_data → ADMIN_ID, загрузка нового .xlsx админом) + aiohttp раздаёт `webapp/` на PORT.
- `build_data.py` — `build(xlsx)`: xlsx → `webapp/products.json` + `webapp/icons/*.webp` (72×72, дубликаты картинок склеены по md5).
- `webapp/index.html` — Telegram Mini App (поиск, категории, $/сум, корзина, заявка через `tg.sendData`).
- `webapp/products.json` — каталог (минифицированный, короткие ключи).
- `webapp/icons/<id>.webp` — иконки товаров, ~2 КБ каждая.

## Формат products.json — массив объектов
| ключ | значение |
|---|---|
| `n` | название |
| `p` | цена в USD (уже +20%) |
| `c` | категория (= лист прайса: Hikvision, TpLink, …) |
| `s` | раздел внутри категории (может быть "") |
| `d` | описание ≤220 символов (может быть "") |
| `i` | id иконки → `icons/{i}.webp` (ключа нет, если фото нет) |

Цена в сумах = `p * RATE` (RATE=12500, в `bot.py` и `index.html`).

## Env
`BOT_TOKEN`, `ADMIN_ID`, `BASE_URL` (HTTPS), `PORT`=8080, `RATE`=12500.

## Правила
- Не менять формат products.json без правки `index.html`.
- Исходный `price.xlsx` не входит в архив (30 МБ); админ отправляет его боту — каталог и иконки пересоберутся.
