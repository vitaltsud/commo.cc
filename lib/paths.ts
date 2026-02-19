/**
 * SEO locale URLs: /country/ = default lang; /country/lang/ = non-default only.
 */

import type { CountryCode, LocaleCode } from "@/lib/countries";
import { getDefaultLangForCountry } from "@/lib/countries";

/** Build path: /country/ or /country/path for default lang; /country/lang/... for non-default. */
export function localePath(
  country: CountryCode | string,
  lang: LocaleCode | string,
  path: string = ""
): string {
  const segment = path ? (path.startsWith("/") ? path : `/${path}`) : "";
  const defaultLang = getDefaultLangForCountry(country as CountryCode);
  if (lang === defaultLang) return `/${country}${segment}`;
  return `/${country}/${lang}${segment}`;
}

/** Path without locale prefix for same-locale navigation (path only, e.g. "how-it-works", "search") */
export function sameLocalePath(path: string = ""): string {
  return path ? (path.startsWith("/") ? path.slice(1) : path) : "";
}
