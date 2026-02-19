# Документация commo.cc

## Сервер (Kontabo 84.247.164.76)

- **[server/README.md](server/README.md)** — хост, IP, SSH по ключам.
- **[server/ASSESSMENT.md](server/ASSESSMENT.md)** — оценка имеющегося софта: скрипт разведки и как его запустить.
- **[server/domains.md](server/domains.md)** — добавление веб-доменов (commo.cc, adm.commo.cc) без поломки существующих систем.
- Примеры vhost: `server/nginx-commo.example.conf`, `server/apache-commo.example.conf`.

- **[localization.md](localization.md)** — локализация по странам, языки контента, языки общения клиента и мастера.
- **[urls-and-seo.md](urls-and-seo.md)** — структура URL (/страна/ = дефолтный язык, /страна/язык/ для остальных), middleware, canonical, hreflang.
- **[translation-system.md](translation-system.md)** — система перевода: ядро и ключи на английском, строки из локалей; fallback на en.

## Развёртывание

- **[deployment/plan.md](deployment/plan.md)** — пошаговый план развёртывания софта (разведка → домены → окружение → сборка → пост-деплой). Все шаги с учётом того, что на сервере уже есть другие системы.
