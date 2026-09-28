# KSS Telegram bot + Mini App

1. @BotFather → /newbot → токен. Свой ID узнайте у @userinfobot.
2. Нужен HTTPS-адрес. Быстрый тест: `cloudflared tunnel --url http://localhost:8080` (даст https://xxx.trycloudflare.com).
   Для постоянной работы — сервер + домен (Caddy/Nginx) на порт 8080.
3. Запуск:
   pip install -r requirements.txt
   export BOT_TOKEN=... ADMIN_ID=... BASE_URL=https://ваш-домен
   python bot.py
   (или: docker build -t kss . && docker run -d --restart=always -e BOT_TOKEN=... -e ADMIN_ID=... -e BASE_URL=... -p 8080:8080 kss)
4. Обновление цен: просто отправьте новый .xlsx боту (с вашего аккаунта) — каталог обновится автоматически.
Курс сум: RATE в bot.py и в webapp/index.html (константа RATE).
