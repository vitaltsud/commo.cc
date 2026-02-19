# Документация commo.cc

## Сервер (Kontabo 84.247.164.76)

- **[server/README.md](server/README.md)** — хост, IP, SSH по ключам.
- **[server/domains.md](server/domains.md)** — добавление веб-доменов (commo.cc, adm.commo.cc) без поломки существующих систем.
- Примеры vhost: `server/nginx-commo.example.conf`, `server/apache-commo.example.conf`.

## Развёртывание

- **[deployment/plan.md](deployment/plan.md)** — пошаговый план развёртывания софта (разведка → домены → окружение → сборка → пост-деплой). Все шаги с учётом того, что на сервере уже есть другие системы.
