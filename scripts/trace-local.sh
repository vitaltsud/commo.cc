#!/usr/bin/env bash
# Трассировка с локальной машины: DNS, доступность commo.cc по HTTP/HTTPS.
# Запуск: bash scripts/trace-local.sh

echo "=============================================="
echo "  Трассировка commo.cc (с твоей машины)"
echo "=============================================="
echo ""

SERVER_IP="84.247.164.76"
OK="[OK]"
FAIL="[FAIL]"

echo "1. DNS: commo.cc"
if command -v dig &>/dev/null; then
  IP=$(dig +short commo.cc 2>/dev/null | tail -1)
  if [ -n "$IP" ]; then
    echo "   commo.cc -> $IP"
    if [ "$IP" = "$SERVER_IP" ]; then
      echo "   $OK домен указывает на сервер $SERVER_IP"
    else
      echo "   $FAIL домен указывает на $IP, а приложение на сервере $SERVER_IP — DNS ведёт не туда"
    fi
  else
    echo "   $FAIL dig +short commo.cc пусто"
  fi
else
  echo "   (dig не установлен, установи bind-utils/dnsutils)"
fi
echo ""

echo "2. HTTP: http://commo.cc/"
CODE=$(curl -sS -o /dev/null -w "%{http_code}" --connect-timeout 5 http://commo.cc/ 2>/dev/null || echo "000")
if [ "$CODE" = "200" ] || [ "$CODE" = "301" ] || [ "$CODE" = "302" ]; then
  echo "   $OK HTTP ответ $CODE"
else
  echo "   $FAIL HTTP ответ $CODE (таймаут или ошибка)"
fi
echo ""

echo "3. HTTPS: https://commo.cc/"
CODE=$(curl -sS -o /dev/null -w "%{http_code}" --connect-timeout 5 -k https://commo.cc/ 2>/dev/null || echo "000")
if [ "$CODE" = "200" ] || [ "$CODE" = "301" ] || [ "$CODE" = "302" ]; then
  echo "   $OK HTTPS ответ $CODE"
else
  echo "   $FAIL HTTPS ответ $CODE"
fi
echo ""

echo "4. Прямой запрос на IP (обход DNS): http://$SERVER_IP/"
echo "   (если порт 80 не открыт снаружи, будет таймаут — это нормально)"
CODE=$(curl -sS -o /dev/null -w "%{http_code}" --connect-timeout 3 -H "Host: commo.cc" "http://$SERVER_IP/" 2>/dev/null || echo "000")
echo "   Ответ: $CODE"
echo ""

echo "=============================================="
echo "Если DNS не на $SERVER_IP — поменяй A-запись у регистратора."
echo "Если HTTP/HTTPS не 200/301/302 — на сервере запусти: bash scripts/trace-server.sh"
echo "=============================================="
