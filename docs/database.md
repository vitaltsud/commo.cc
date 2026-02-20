# База данных (SQLite)

## Схема

- **users** — заказчики (`role=client`) и мастера (`role=pro`): id, email, name, role, country_code, created_at.
- **projects** — проекты заказчиков: id, client_id, country_code, category_slug, title, description, status, created_at.
- **pro_profiles** — профили мастеров по категориям: user_id, category_slug, rating, languages (JSON), verified, bio.

Категории по-прежнему задаются в коде (`lib/categories.ts`). В БД хранятся только пользователи, проекты и профили мастеров.

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

- `GET /api/projects?country=pl&category=cleaning` — список проектов по стране и категории.
- `GET /api/pros?country=pl&category=cleaning` — список мастеров по стране и категории.

Страница `/country/lang/search/category` загружает проекты и мастеров напрямую из БД (без вызова API), чтобы не делать self-request.
