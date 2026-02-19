#!/bin/bash
# Разведка сервера 84.247.164.76 — только чтение, ничего не меняет.
# Запуск на сервере: bash assess-server.sh 2>&1 | tee assessment-report.txt

set -e
echo "=== COMMO.CC SERVER ASSESSMENT ==="
echo "Date: $(date -Iseconds 2>/dev/null || date)"
echo ""

echo "--- 1. OS ---"
if [ -f /etc/os-release ]; then cat /etc/os-release; else echo "No /etc/os-release"; fi
echo ""

echo "--- 2. Web server (which) ---"
which nginx 2>/dev/null && echo "nginx: $(nginx -v 2>&1)" || echo "nginx: not found"
which apache2 2>/dev/null && echo "apache2: $(apache2 -v 2>&1 | head -1)" || true
which httpd 2>/dev/null && echo "httpd: $(httpd -v 2>&1 | head -1)" || true
echo ""

echo "--- 3. Web server (systemd) ---"
for s in nginx apache2 httpd; do
  if systemctl is-active --quiet $s 2>/dev/null; then echo "$s: active"; fi
  if systemctl is-enabled $s 2>/dev/null | grep -q enabled; then echo "$s: enabled"; fi
done 2>/dev/null || true
echo ""

echo "--- 4. Sites enabled (nginx) ---"
if [ -d /etc/nginx/sites-enabled ]; then
  ls -la /etc/nginx/sites-enabled/ 2>/dev/null || echo "no access"
else
  echo "No nginx sites-enabled"
fi
echo ""

echo "--- 5. Sites enabled (Apache) ---"
if [ -d /etc/apache2/sites-enabled ]; then
  ls -la /etc/apache2/sites-enabled/ 2>/dev/null || echo "no access"
else
  echo "No apache2 sites-enabled"
fi
echo ""

echo "--- 6. Listening ports (80, 443, 3000, 3001) ---"
(ss -tlnp 2>/dev/null || netstat -tlnp 2>/dev/null) | grep -E ':(80|443|3000|3001)\s' || echo "none of 80,443,3000,3001"
echo ""

echo "--- 7. Node / npm / pnpm / pm2 ---"
command -v node >/dev/null 2>&1 && echo "node: $(node -v)" || echo "node: not found"
command -v npm >/dev/null 2>&1 && echo "npm: $(npm -v)" || echo "npm: not found"
command -v pnpm >/dev/null 2>&1 && echo "pnpm: $(pnpm -v)" || echo "pnpm: not found"
command -v pm2 >/dev/null 2>&1 && echo "pm2: $(pm2 -v)" || echo "pm2: not found"
echo ""

echo "--- 8. Node version (nvm if present) ---"
if [ -s "$HOME/.nvm/nvm.sh" ]; then
  . "$HOME/.nvm/nvm.sh" 2>/dev/null
  echo "nvm: present, default: $(node -v 2>/dev/null)"
fi
echo ""

echo "--- 9. Existing web roots (common paths) ---"
for d in /var/www /var/www/html /usr/share/nginx/html; do
  if [ -d "$d" ]; then echo "$d:"; ls -la "$d" 2>/dev/null | head -15; echo ""; fi
done
echo ""

echo "--- 10. Disk (root and /var) ---"
df -h / /var 2>/dev/null || df -h
echo ""

echo "--- 11. Certbot / Let's Encrypt ---"
which certbot 2>/dev/null && echo "certbot: $(certbot --version 2>&1)" || echo "certbot: not found"
[ -d /etc/letsencrypt/live ] && echo "letsencrypt live: $(ls /etc/letsencrypt/live 2>/dev/null)" || true
echo ""

echo "--- 12. Databases (processes only, no auth) ---"
pgrep -a mysql 2>/dev/null || true
pgrep -a mariadb 2>/dev/null || true
pgrep -a postgres 2>/dev/null || true
pgrep -a mongod 2>/dev/null || true
echo ""

echo "=== END ASSESSMENT ==="
