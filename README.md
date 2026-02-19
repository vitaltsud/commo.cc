# commo.cc

Global Trust Marketplace — сервисный маркетплейс (клиенты ↔ мастера), жёсткая верификация и неизменяемые рейтинги.

- **Стек:** Next.js (App Router), Tailwind, Framer Motion, Google OAuth, Google Chat
- **Домены:** [commo.cc](https://commo.cc), [adm.commo.cc](https://adm.commo.cc)
- **Сервер:** Kontabo 84.247.164.76

## Документация

- [docs/README.md](docs/README.md) — оглавление
- [docs/server/](docs/server/) — хостинг, SSH, добавление доменов
- [docs/deployment/plan.md](docs/deployment/plan.md) — план развёртывания

## Репозиторий

**https://github.com/vitaltsud/commo.cc**

Клонирование и запуск:

```bash
git clone https://github.com/vitaltsud/commo.cc.git
cd commo.cc
npm install
npm run dev    # http://localhost:3000
```

Сборка: `npm run build`. Старт продакшена: `npm run start`.

**Деплой на сервер (по твоей команде):** скопируй `.env.deploy.example` в `.env.deploy`, укажи `COMMO_SSH` и `COMMO_REMOTE_PATH`. Дальше: `./scripts/deploy.sh` (bash) или `powershell -File scripts/deploy.ps1` — скрипт по SSH зайдёт на 84.247.164.76 и сделает pull, build, перезапуск. Подробнее: [docs/deployment/plan.md](docs/deployment/plan.md).

**Auth:** Sign in with Google — заглушка. Добавь `GOOGLE_CLIENT_ID` в `.env.local` и укажи redirect URI в Google Console: `http://localhost:3000/api/auth/callback/google`. Полный обмен code → session — дальше (NextAuth или свой бэкенд).
