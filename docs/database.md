# База данных (SQLite)

## Схема

- **users** — один аккаунт может быть и заказчиком, и мастером: id, google_id (уникальный, для OAuth), email, name, country_code, client_rating (рейтинг как заказчик), created_at. Поле role опционально (для совместимости с сидом).
- **projects** — проекты заказчиков: id, client_id → users.id, country_code, city_slug, category_slug, title, description, status, created_at.
- **pro_profiles** — профили мастеров по категориям: user_id → users.id, slug (для URL), plan (free/basic/premium), category_slug, rating (рейтинг как мастер), languages (JSON), verified (обязательно для выдачи в поиске), bio. Города — в pro_profile_cities.

Категории задаются в коде (`lib/categories.ts`). В выдаче мастеров участвуют только записи с `pro_profiles.verified = true`; фильтр по `users.role` не используется. Логика ролей и верификации: `docs/logic.md`.

## Локальный запуск

1. Установка зависимостей: `npm install`.
2. Наполнение тестовыми данными (Польша): `npm run seed`.  
   Создаётся файл `data/commo.db` (или путь из `DATABASE_PATH`).
3. Запуск: `npm run dev`. На странице поиска по категории (например `/pl/pl/search/cleaning`) отображаются проекты и мастера из БД.

## Продакшен (сервер)

- Путь к БД задаётся переменной окружения `DATABASE_PATH` (по умолчанию `./data/commo.db` относительно рабочей директории приложения).
- После первого деплоя на сервере нужно один раз выполнить наполнение:  
  `cd $COMMO_REMOTE_PATH && npm run seed`.
- Папка `data/` должна быть доступна для записи процессу приложения.

## API

- `GET /api/projects?country=pl&category=cleaning&city=warsaw` — список проектов по стране, категории и опционально городу.
- `GET /api/pros?country=pl&category=cleaning&city=warsaw` — список **верифицированных** мастеров по стране, категории и опционально городу.
- `GET /api/auth/session` — текущий пользователь и роли (client, pro, proVerified); cookie-based.

Страницы проектов и мастеров (`/country/.../projects/[category]`, `contractors/[category]`) загружают данные напрямую из БД через `lib/search-data.ts` (без вызова этих API).
