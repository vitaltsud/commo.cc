# Настройка Google OAuth для commo.cc

## В форме «Create OAuth client ID»

### 1. Application type
Выберите **Web application**.

### 2. Name *
- Один клиент для всего: **commo.cc** (или «Commo Front + Admin»).
- Либо два клиента: «Commo Front» и «Commo Admin» — тогда для каждого свои шаги ниже.

---

### 3. Authorized JavaScript origins

Сюда добавляются **источники** (origin), с которых разрешён запуск OAuth в браузере.

**Один клиент для фронта и админки — добавьте по одному полю:**

| Окружение | URI |
|-----------|-----|
| Локально (фронт) | `http://localhost:3000` |
| Локально (админка) | `http://localhost:3001` |
| Продакшен (фронт) | `https://commo.cc` |
| Продакшен (админка) | `https://adm.commo.cc` |

Или только то, что уже используете (например, пока только фронт):

- `http://localhost:3000`
- `https://commo.cc`

---

### 4. Authorized redirect URIs

Сюда — **куда** Google вернёт пользователя после входа (callback).

Фактический callback в коде: **`{origin}/api/auth/callback/google`**.

**Добавьте по одной строке на каждое приложение/окружение:**

| Окружение | Redirect URI |
|-----------|--------------|
| Локально (фронт) | `http://localhost:3000/api/auth/callback/google` |
| Локально (админка) | `http://localhost:3001/api/auth/callback/google` |
| Продакшен (фронт) | `https://commo.cc/api/auth/callback/google` |
| Продакшен (админка) | `https://adm.commo.cc/api/auth/callback/google` |

Или минимум для старта:

- `http://localhost:3000/api/auth/callback/google`
- `https://commo.cc/api/auth/callback/google`

---

## Переменные окружения

После создания клиента в Google Console:

**Фронт (`.env.local` в корне проекта):**
```env
GOOGLE_CLIENT_ID=ваш_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=ваш_client_secret
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Продакшен (фронт):**  
`NEXTAUTH_URL` и `NEXT_PUBLIC_APP_URL` = `https://commo.cc` (без слэша в конце).

**Админка (отдельный проект или порт):**  
Используйте те же `GOOGLE_CLIENT_ID` и `GOOGLE_CLIENT_SECRET`, а `NEXTAUTH_URL` и `NEXT_PUBLIC_APP_URL` укажите на URL админки (например `http://localhost:3001` или `https://adm.commo.cc`). Соответствующие origin и redirect URI должны быть добавлены в том же OAuth client в Google Console, как в таблицах выше.
