/**
 * SEO locale URLs: GEO first, then language — /country/lang/...
 * e.g. /pl/pl/, /gr/en/, /ua/uk/how-it-works. Google: "content for market X, language Y".
 */

import type { CountryCode, LocaleCode } from "@/lib/countries";

/** Build path: /{country}/{lang}{path} */
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
