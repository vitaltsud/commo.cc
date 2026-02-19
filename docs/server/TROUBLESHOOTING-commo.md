# Почему https://commo.cc не открывается

**Трассировка (найти причину):**
- **С локальной машины:** `bash scripts/trace-local.sh` — проверка DNS и доступности по HTTP/HTTPS.
- **На сервере по SSH:** `cd /var/www/commo.cc && bash scripts/trace-server.sh` — проверка Node, PM2, порта 3000, nginx, SSL. В выводе смотри строки с `[FAIL]`.

Ниже — типичные причины и что проверить вручную.

## 1. Nginx отдаёт статику вместо Next.js

**Симптом:** пустая страница, 404 или старый контент.

В конфиге для `commo.cc` должно быть **проксирование на приложение**, а не `root` на папку с HTML:

```nginx
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

**Что сделать:** заменить vhost для commo.cc на конфиг из [nginx-commo.example.conf](./nginx-commo.example.conf), затем:

```bash
sudo nginx -t && sudo systemctl reload nginx
```

---

## 2. Нет HTTPS (SSL)

**Симптом:** https://commo.cc не открывается, «соединение прервано» или предупреждение сертификата.

Сначала проверьте по HTTP: **http://commo.cc** и **http://84.247.164.76** (с портом при необходимости). Если открывается только по HTTP — нужно настроить SSL.

**Что сделать:**

```bash
# Установить certbot, если ещё нет
sudo apt install certbot python3-certbot-nginx -y

# Выдать сертификат для commo.cc (nginx должен уже слушать 80 для commo.cc)
sudo certbot --nginx -d commo.cc -d www.commo.cc
```

После этого добавить в vhost блок `listen 443 ssl http2` с путями к сертификатам (как в примере в nginx-commo.example.conf) и снова `nginx -t && systemctl reload nginx`.

---

## 3. Next.js (PM2) не запущен

**Симптом:** 502 Bad Gateway или «Connection refused».

**Проверка на сервере:**

```bash
# Приложение слушает порт 3000?
ss -tlnp | grep 3000

# PM2: процесс commo запущен?
pm2 list
pm2 logs commo --lines 30
```

**Запуск:**

```bash
cd /var/www/commo.cc   # или COMMO_REMOTE_PATH из .env.deploy
source ~/.nvm/nvm.sh   # если используете nvm
npm run build
pm2 start npm --name commo -- start
# или: pm2 restart commo
pm2 save
```

---

## 4. Открывается другой сайт (n8n или заглушка)

**Ожидается:** основной сайт — **https://commo.cc**, админ-панель — **https://adm.commo.cc**. **n8n** только на **https://ai.crmca.cc/** (отдельный vhost, не менять).

**Симптом:** по commo.cc или adm.commo.cc открывается не то (например n8n, «Launching Soon» и т.п.). На одном IP несколько доменов: Nginx выбирает vhost по заголовку `Host`. Если для `commo.cc` или `adm.commo.cc` нет своего server-блока или он не в sites-enabled, отдаётся default или другой сайт.

**Что сделать:** убедиться, что есть конфиг с `server_name commo.cc;` (и www.commo.cc при необходимости) и он подключён:

```bash
ls -la /etc/nginx/sites-enabled/ | grep commo
sudo nginx -T | grep -A2 "server_name.*commo"
```

Должен быть симлинк на конфиг с commo.cc и внутри — `server_name commo.cc;`.

---

## 5. DNS не указывает на сервер

**Симптом:** сайт не открывается вообще или таймаут.

Проверьте:

```bash
# Должен быть IP вашего сервера (84.247.164.76)
dig +short commo.cc
dig +short www.commo.cc
```

В панели регистратора домена должны быть A-записи: `commo.cc` и `www.commo.cc` → `84.247.164.76`. После смены DNS подождите 5–60 минут.

---

## 6. Порт 80/443 закрыт файрволом

На сервере:

```bash
sudo ufw status
# Должны быть разрешены 80 и 443
sudo ufw allow 80
sudo ufw allow 443
sudo ufw reload
```

---

## Краткий чеклист

| Проверка | Команда / действие |
|----------|-------------------|
| Nginx проксирует на 3000 | В vhost `proxy_pass http://127.0.0.1:3000` |
| Приложение запущено | `pm2 list`, `ss -tlnp \| grep 3000` |
| SSL включён для commo.cc | `certbot --nginx -d commo.cc -d www.commo.cc` |
| DNS ведёт на сервер | `dig +short commo.cc` → 84.247.164.76 |
| Nginx без ошибок | `nginx -t && systemctl reload nginx` |

После изменений конфига или PM2 всегда: `nginx -t && systemctl reload nginx` и при необходимости `pm2 restart commo`.
