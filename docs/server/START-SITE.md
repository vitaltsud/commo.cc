# Как запустить сайт commo.cc на сервере

Выполнить **один раз** на сервере (по SSH). Не трогаем другие проекты (n8n на ai.crmca.cc и т.д.).

## 1. Репозиторий и сборка

```bash
# Путь к проекту (должен совпадать с COMMO_REMOTE_PATH из .env.deploy)
cd /var/www/commo.cc

# Node (если используете nvm)
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

# Зависимости и сборка
npm ci
npm run build
```

## 2. Запуск приложения (PM2)

```bash
cd /var/www/commo.cc

# Запуск через ecosystem (порт 3000)
pm2 start ecosystem.config.cjs

# Сохранить список процессов, чтобы после перезагрузки сервера PM2 поднял commo снова
pm2 save
pm2 startup
```

Проверка: приложение должно слушать порт 3000.

```bash
ss -tlnp | grep 3000
pm2 list
```

## 3. Nginx: отдельный vhost для commo.cc

Конфиг **только для commo.cc**, остальные сайты не трогаем.

```bash
# Скопировать пример конфига
sudo cp /var/www/commo.cc/docs/server/nginx-commo.example.conf /etc/nginx/sites-available/commo.cc

# Включить сайт (симлинк)
sudo ln -sf /etc/nginx/sites-available/commo.cc /etc/nginx/sites-enabled/commo.cc

# Проверить и перезагрузить nginx
sudo nginx -t && sudo systemctl reload nginx
```

После этого **http://commo.cc** должен открываться (редирект на приложение на порту 3000).

## 4. HTTPS (SSL)

Основной сайт: **https://commo.cc**. Админ-панель: **https://adm.commo.cc** (не n8n; n8n только на ai.crmca.cc).

```bash
sudo apt install -y certbot python3-certbot-nginx

# Сертификаты для основного сайта и админки
sudo certbot --nginx -d commo.cc -d www.commo.cc -d adm.commo.cc
```

Certbot добавит блоки для 443. Затем:

```bash
sudo nginx -t && sudo systemctl reload nginx
```

## 5. Дальнейшие деплои

С локальной машины (не на сервере):

```bash
./scripts/deploy.sh
# или
powershell -File scripts/deploy.ps1
```

Скрипт сделает `git pull`, `npm ci`, `npm run build`, `pm2 restart commo`. Nginx и SSL больше трогать не нужно.

---

## Если сайт не открывается

- [TROUBLESHOOTING-commo.md](./TROUBLESHOOTING-commo.md) — типичные причины и проверки.
- Убедиться: PM2 процесс `commo` запущен, порт 3000 слушается, в nginx для `commo.cc` стоит `proxy_pass http://127.0.0.1:3000`.
