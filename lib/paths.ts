/**
 * SEO locale URLs:
 * Default lang: /country/, /country/city/..., /country/contractor/hash
 * Non-default lang: /country/lang/..., /country/lang/city/..., /country/lang/contractor/hash
 */

import type { CountryCode, LocaleCode } from "@/lib/countries";
import { getDefaultLangForCountry, getContentLocalesForCountry } from "@/lib/countries";
import { isCitySlug } from "@/lib/city-slugs";

/** Build path: country, [lang if not default], path. For projects/ and contractors/ paths, city is appended at end: /pl/ru/projects/cleaning/warsaw. */
export function localePath(
  country: CountryCode | string,
  lang: LocaleCode | string,
  path: string = "",
  citySlug?: string | null
): string {
  const rawPath = path ? (path.startsWith("/") ? path.slice(1) : path) : "";
  const isProjectsOrContractors = rawPath.startsWith("projects/") || rawPath.startsWith("contractors/");
  const segment = isProjectsOrContractors && citySlug
    ? `/${rawPath}/${citySlug}`
    : rawPath
      ? `/${rawPath}`
      : "";
  const cityPart = !isProjectsOrContractors && citySlug ? `/${citySlug}` : "";
  const defaultLang = getDefaultLangForCountry(country as CountryCode);
  if (lang === defaultLang) return `/${country}${cityPart}${segment}`;
  return `/${country}/${lang}${cityPart}${segment}`;
}

/** Path without locale prefix: /pl/ru/projects/cleaning/warsaw -> "projects/cleaning/warsaw". City is at end for projects/ and contractors/. For /pl/ru/rome/projects returns "projects". */
export function pathWithoutLocale(pathname: string, countryCode: string): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] !== countryCode || segments.length < 2) return "";
  const contentLocales = getContentLocalesForCountry(countryCode);
  const second = segments[1];
  if (contentLocales.includes(second as LocaleCode)) {
    const rest = segments.slice(2);
    if (rest.length === 2 && isCitySlug(countryCode, rest[0]) && (rest[1] === "projects" || rest[1] === "contractors"))
      return rest[1];
    return rest.join("/") ?? "";
  }
  if (second && isCitySlug(countryCode, second)) return segments.slice(2).join("/") ?? "";
  return segments.slice(1).join("/") ?? "";
}

/** Path without locale prefix for same-locale navigation (path only, e.g. "how-it-works", "search") */
export function sameLocalePath(path: string = ""): string {
  return path ? (path.startsWith("/") ? path.slice(1) : path) : "";
}
