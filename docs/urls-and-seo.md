# URL-структура и SEO

## Иерархия URL

- **Сначала GEO (рынок), затем язык.** Так Google однозначно понимает: «контент для рынка X на языке Y».

Правило:

- **`/страна/`** — страна на **языке по умолчанию** (один сегмент).
- **`/страна/язык/`** — только для **недефолтных** языков.

Примеры:

| URL        | Смысл                    |
|-----------|---------------------------|
| `/pl/`    | Польша, польский (дефолт) |
| `/pl/en/` | Польша, английский        |
| `/pl/signin` | Польша (дефолт), страница входа |
| `/ua/`    | Украина, украинский       |
| `/ua/ru/` | Украина, русский          |
| `/de/`    | Германия, немецкий        |
| `/gb/`    | UK, английский (один язык) |
| `/us/`    | США, английский (дефолт)  |
| `/us/es/` | США, испанский            |

Дефолтный язык страны — первый в `contentLocales` в `lib/countries.ts` (например для Польши это `pl`).

### Проекты и исполнители: город в конце URL

- **`/страна/язык/projects/категория`** — проекты по категории (все города).
- **`/страна/язык/projects/категория/город`** — проекты по категории в городе (например `/pl/ru/projects/cleaning/warsaw`).
- Аналогично **`/страна/язык/contractors/категория`** и **`/страна/язык/contractors/категория/город`**.

Старый формат с городом в середине (**`/pl/ru/warsaw/projects/cleaning`**) отдаёт **301 redirect** на новый: `/pl/ru/projects/cleaning/warsaw`.

**Главная с городом:** `/страна/язык/город` (например `/pl/ru/warsaw`) — главная страница с фильтрацией списков проектов и мастеров по выбранному городу. Маршрут: `app/[country]/[lang]/[city]/page.tsx`. Middleware выставляет заголовок `x-city` для такого URL.

### Отдельные страницы списков

- **`/страна/язык/projects`** — все проекты страны (маршрут `app/[country]/[lang]/projects/page.tsx`).
- **`/страна/язык/город/projects`** — проекты в выбранном городе (`app/[country]/[lang]/[city]/projects/page.tsx`).
- **`/страна/язык/contractors`** — все мастера страны (`app/[country]/[lang]/contractors/page.tsx`).
- **`/страна/язык/город/contractors`** — мастера в городе (`app/[country]/[lang]/[city]/contractors/page.tsx`).

В шапке пункты «Проекты» и «Майстри» ведут на эти страницы (с учётом выбранного города в URL). Middleware для путей `.../город/projects` и `.../город/contractors` выставляет `x-city`.

## Где что лежит

| Задача | Файл / функция |
|--------|-----------------|
| Дефолтный язык страны | `lib/countries.ts` → `getDefaultLangForCountry(country)` |
| Построение пути (короткий для дефолта) | `lib/paths.ts` → `localePath(country, lang, path)` |
| Canonical и alternates (hreflang) | `lib/hreflang.ts` → `getAlternateUrls`, `pathSuffixFromInternalPath` |
| Обработка запросов: rewrite, redirect | `middleware.ts` |
| Метаданные страницы (canonical, languages) | `app/[country]/[lang]/layout.tsx` → `generateMetadata` |

## Поведение middleware

1. **Запрос `/pl/` или `/pl/signin`**  
   Внутренний **rewrite** в `/pl/pl/` и `/pl/pl/signin` (приложение отдаёт контент). В заголовке `x-pathname` остаётся публичный URL (`/pl/`, `/pl/signin`) для canonical.

2. **Запрос `/pl/pl/` или `/pl/pl/signin`**  
   **301 redirect** на каноничный `/pl/` и `/pl/signin` (чтобы в адресной строке был один сегмент для дефолтного языка).

3. **Запрос `/en_pl/` (legacy)**  
   **301 redirect** на `/pl/en/` (каноничный формат: страна → язык).

4. **Запрос `/pl/xxx/`**, где `xxx` не язык (например `signin`, `how-it-works`)  
   **Rewrite** в `/pl/<дефолтный_язык>/xxx/`, `x-pathname` = `/pl/xxx/`.

5. **Один сегмент без локали** (например `/signin`, `/my-projects`, `/pro`)  
   **Redirect** на `/pl/signin`, `/pl/my-projects`, `/pl/pro` (дефолтная страна Польша). Полный список таких путей — в `middleware.ts` (`legacyPaths`).

## Ссылки и canonical

- **Внутренние ссылки:** везде используется `localePath(country, lang, path)` (и хук `useLocalePath()` в компонентах). Для дефолтного языка возвращается `/country/path`, для остальных — `/country/lang/path`.
- **Canonical:** в layout для дефолтного языка задаётся `https://commo.cc/pl/` (и т.п.), для недефолтного — `https://commo.cc/pl/en/`.
- **Hreflang:** `getAlternateUrls(suffix)` строит alternates в том же формате: для дефолтного языка — один сегмент страны, для остальных — два.

## Добавление страны

В `lib/countries.ts` добавить страну с `contentLocales`. Первый элемент массива будет дефолтным языком для `/страна/`. Маршруты `app/[country]/[lang]/` подхватят новую страну автоматически; middleware использует `getCountryByCode` и `getContentLocalesForCountry`.
