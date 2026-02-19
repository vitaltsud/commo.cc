#!/usr/bin/env bash
# Трассировка на сервере: почему commo.cc не открывается.
# Запуск на сервере: bash scripts/trace-server.sh

set -e
APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
SERVER_IP="84.247.164.76"

echo "=============================================="
echo "  Трассировка commo.cc (прод)"
echo "  Каталог: $APP_DIR"
echo "=============================================="
echo ""

# 1. DNS
echo "1. DNS"
if command -v dig &>/dev/null; then
  COMMO_IP=$(dig +short commo.cc 2>/dev/null | tail -1)
  if [ -n "$COMMO_IP" ]; then
    echo "   [OK] commo.cc -> $COMMO_IP"
    [ "$COMMO_IP" != "$SERVER_IP" ] && echo "   ВНИМАНИЕ: домен $COMMO_IP, сервер $SERVER_IP"
  else
    echo "   [FAIL] dig commo.cc пусто"
  fi
else
  echo "   (dig не установлен)"
fi
echo ""

# 2. Node
echo "2. Node"
[ -s "$HOME/.nvm/nvm.sh" ] && . "$HOME/.nvm/nvm.sh"
[ -s "/root/.nvm/nvm.sh" ] && . "/root/.nvm/nvm.sh"
command -v node &>/dev/null && echo "   [OK] $(node -v)" || echo "   [FAIL] node не найден"
echo ""

# 3. Порт 3000
echo "3. Порт 3000"
ss -tlnp 2>/dev/null | grep -q ':3000\s' && echo "   [OK] слушается" || echo "   [FAIL] не слушается — приложение не запущено"
echo ""

# 4. PM2
echo "4. PM2"
if command -v pm2 &>/dev/null; then
  pm2 describe commo &>/dev/null && echo "   [OK] процесс commo есть" || echo "   [FAIL] процесса commo нет"
else
  echo "   [FAIL] pm2 не найден"
fi
echo ""

# 5. curl localhost:3000
echo "5. curl localhost:3000"
CODE=$(curl -sS -o /dev/null -w "%{http_code}" --connect-timeout 2 http://127.0.0.1:3000/ 2>/dev/null || echo "err")
[ "$CODE" = "200" ] && echo "   [OK] $CODE" || echo "   [FAIL] код $CODE"
echo ""

# 6. Nginx vhost
echo "6. Nginx commo.cc"
[ -f /etc/nginx/sites-available/commo.cc ] && echo "   [OK] файл есть" || echo "   [FAIL] файла нет"
grep -q "proxy_pass.*3000" /etc/nginx/sites-available/commo.cc 2>/dev/null && echo "   [OK] proxy_pass 3000" || echo "   [FAIL] нет proxy_pass на 3000"
[ -L /etc/nginx/sites-enabled/commo.cc ] && echo "   [OK] включён" || echo "   [FAIL] не в sites-enabled"
echo ""

# 7. nginx -t
echo "7. nginx -t"
sudo nginx -t 2>&1 && echo "   [OK]" || echo "   [FAIL]"
echo ""

# 8. SSL
echo "8. SSL"
[ -d /etc/letsencrypt/live/commo.cc ] && echo "   [OK] сертификат есть" || echo "   [FAIL] нет certbot для commo.cc"
echo ""

echo "=============================================="
echo "Смотри [FAIL] — там причина. Часто: порт 3000 или DNS."
echo "=============================================="
