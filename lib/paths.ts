/**
 * SEO-standard locale URLs: /country/lang/...
 * e.g. /pl/pl/, /ua/uk/how-it-works, /de/en/settings
 */

import type { CountryCode, LocaleCode } from "@/lib/countries";

/** Build path with locale prefix: /{country}/{lang}{path} */
export function localePath(
  country: CountryCode | string,
  lang: LocaleCode | string,
  path: string = ""
): string {
  const segment = path ? (path.startsWith("/") ? path : `/${path}`) : "";
  return `/${country}/${lang}${segment}`;
}

/** Path without locale prefix for same-locale navigation (path only, e.g. "how-it-works", "search") */
export function sameLocalePath(path: string = ""): string {
  return path ? (path.startsWith("/") ? path.slice(1) : path) : "";
}
