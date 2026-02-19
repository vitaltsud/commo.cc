#!/usr/bin/env bash
# Один раз запустить на сервере из корня репо: bash scripts/server-setup.sh
# Собирает приложение, поднимает PM2, подключает nginx для commo.cc (остальные сайты не трогает).

set -e
APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$APP_DIR"

echo "=== commo.cc: сборка и запуск (каталог $APP_DIR) ==="

# Node (nvm)
if [ -s "$HOME/.nvm/nvm.sh" ]; then
  . "$HOME/.nvm/nvm.sh"
elif [ -s "/root/.nvm/nvm.sh" ]; then
  . "/root/.nvm/nvm.sh"
fi

echo "=== npm ci + build ==="
npm ci
npm run build

echo "=== PM2 ==="
pm2 delete commo 2>/dev/null || true
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup 2>/dev/null || true

echo "=== Nginx (vhost только для commo.cc) ==="
sudo cp "$APP_DIR/docs/server/nginx-commo.example.conf" /etc/nginx/sites-available/commo.cc
sudo ln -sf /etc/nginx/sites-available/commo.cc /etc/nginx/sites-enabled/commo.cc
sudo nginx -t && sudo systemctl reload nginx

echo ""
echo "Готово. Проверь: http://commo.cc (должен открываться)."
echo "HTTPS: выполни на сервере: sudo certbot --nginx -d commo.cc -d www.commo.cc"
echo "Потом с локальной машины деплой: ./scripts/deploy.sh"
