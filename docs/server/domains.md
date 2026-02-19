# Добавление веб-доменов на 84.247.164.76

**Важно:** на сервере уже есть работающие системы. Добавляем только новые домены и конфиги, существующие не трогаем.

## Домены для commo.cc

| Домен        | Назначение        |
|-------------|-------------------|
| `commo.cc`  | Основной маркетплейс |
| `www.commo.cc` | Канонический с www (редирект на commo.cc или наоборот) |
| `adm.commo.cc` | Админ-панель |

---

## План (без поломки текущих систем)

### 1. Узнать, что уже стоит на сервере

По SSH:

```bash
# Веб-сервер
which nginx apache2 2>/dev/null; systemctl is-active nginx apache2 2>/dev/null

# Где лежат конфиги
ls -la /etc/nginx/sites-enabled/ 2>/dev/null
ls -la /etc/apache2/sites-enabled/ 2>/dev/null
```

Дальнейшие шаги — в зависимости от того, nginx или Apache.

### 2. DNS

У регистратора домена (commo.cc) добавить A-записи на `84.247.164.76`:

- `commo.cc` → `84.247.164.76`
- `www.commo.cc` → `84.247.164.76`
- `adm.commo.cc` → `84.247.164.76`

Проверка: `dig commo.cc +short`, `dig adm.commo.cc +short`.

### 3. Nginx: только новый vhost

Не править общий `nginx.conf` и чужие `sites-enabled`. Добавить **отдельный** файл:

```bash
sudo nano /etc/nginx/sites-available/commo.cc
```

Содержимое — см. `docs/server/nginx-commo.example.conf`.

Включить сайт и проверить конфиг:

```bash
sudo ln -s /etc/nginx/sites-available/commo.cc /etc/nginx/sites-enabled/
sudo nginx -t
```

Если `nginx -t` ок — перезагрузить только nginx: `sudo systemctl reload nginx`.

### 4. Apache: только новый vhost

Не править общий `apache2.conf` и чужие сайты. Добавить файл:

```bash
sudo nano /etc/apache2/sites-available/commo.cc.conf
```

Содержимое — см. `docs/server/apache-commo.example.conf`.

Включить и проверить:

```bash
sudo a2ensite commo.cc.conf
sudo apache2ctl configtest
sudo systemctl reload apache2
```

### 5. SSL (после того как HTTP работает)

Рекомендуется Let's Encrypt (certbot), без изменения чужих конфигов:

```bash
sudo certbot --nginx -d commo.cc -d www.commo.cc -d adm.commo.cc
# или для Apache:
# sudo certbot --apache -d commo.cc -d www.commo.cc -d adm.commo.cc
```

Certbot сам добавит фрагменты в конфиги только для указанных доменов.

---

## Чеклист

- [ ] SSH по ключам проверен
- [ ] Определён веб-сервер (nginx/apache)
- [ ] DNS: A-записи для commo.cc, www, adm.commo.cc
- [ ] Добавлен только новый vhost, старые не тронуты
- [ ] `nginx -t` / `apache2ctl configtest` — ок
- [ ] Перезагрузка только reload (reload nginx/apache)
- [ ] SSL через certbot для нужных доменов
