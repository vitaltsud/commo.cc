# Документация commo.cc

- **[project-rules.md](project-rules.md)** — правила проекта: роль ассистента, деплой, переводы, контекст продукта, URL/SEO, **безопасность** (заголовки, редиректы, инъекции, сессия, XSS, секреты).
- **[logic.md](logic.md)** — логика приложения: роли (клиент/мастер в одном аккаунте), верификация, авторизация и сессия, поиск и выдача, рейтинги, хлебные крошки и разметка. Обновлять при изменении логики.

## Сервер (Kontabo 84.247.164.76)

- **[server/README.md](server/README.md)** — хост, IP, SSH по ключам.
- **[server/ASSESSMENT.md](server/ASSESSMENT.md)** — оценка имеющегося софта: скрипт разведки и как его запустить.
- **[server/domains.md](server/domains.md)** — добавление веб-доменов (commo.cc, adm.commo.cc) без поломки существующих систем.
- Примеры vhost: `server/nginx-commo.example.conf`, `server/apache-commo.example.conf`.

- **[localization.md](localization.md)** — локализация по странам, языки контента (в т.ч. итальянский), названия стран на текущем языке, лендинг (карточки стран), языки общения.
- **[urls-and-seo.md](urls-and-seo.md)** — структура URL (город в конце пути для projects/contractors; главная с городом /страна/язык/город), middleware, canonical, hreflang.
- **[database.md](database.md)** — SQLite, схема (users, projects, pro_profiles), сидер для Польши, API.
- **[translation-system.md](translation-system.md)** — система перевода: ядро и ключи на английском, строки из локалей; fallback на en.

## Развёртывание

- **[deployment/plan.md](deployment/plan.md)** — пошаговый план развёртывания софта (разведка → домены → окружение → сборка → пост-деплой). Все шаги с учётом того, что на сервере уже есть другие системы.
