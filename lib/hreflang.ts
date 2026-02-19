/**
 * Hreflang by standard (BCP 47: language-Region).
 * https://developers.google.com/search/docs/specialty/international/localized-versions
 */

import { getValidLocaleSegments, parseLocaleSegment } from "@/lib/locale-format";

const COUNTRY_TO_REGION: Record<string, string> = {
  pl: "PL",
  ua: "UA",
  de: "DE",
  gb: "GB",
  us: "US",
};

export function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? "https://commo.cc";
}

/** BCP 47 tag for locale segment: en_pl → "en-PL", uk_ua → "uk-UA". */
export function localeSegmentToHreflang(segment: string): string {
  const [lang, country] = segment.toLowerCase().split("_");
  const region = COUNTRY_TO_REGION[country ?? ""] ?? (country ?? "").toUpperCase();
  return region ? `${lang}-${region}` : lang;
}

/** All alternate URLs for a path suffix. SEO: GEO first, then language — /country/lang/... (e.g. /pl/en/, /gr/en/). */
export function getAlternateUrls(pathSuffix: string): Record<string, string> {
  const base = getBaseUrl().replace(/\/$/, "");
  const suffix = pathSuffix ? (pathSuffix.startsWith("/") ? pathSuffix : `/${pathSuffix}`) : "";
  const segments = getValidLocaleSegments();
  const out: Record<string, string> = {};
  for (const seg of segments) {
    const parsed = parseLocaleSegment(seg);
    if (!parsed) continue;
    const hreflang = localeSegmentToHreflang(seg);
    out[hreflang] = `${base}/${parsed.country}/${parsed.lang}${suffix}`;
  }
  return out;
}

/** Path suffix from internal path /country/lang/... → "" or "signin" or "how-it-works". */
export function pathSuffixFromInternalPath(pathname: string, country: string, lang: string): string {
  const prefix = `/${country}/${lang}`;
  if (pathname === prefix || pathname === `${prefix}/`) return "";
  if (pathname.startsWith(`${prefix}/`)) {
    return pathname.slice(prefix.length + 1).replace(/\/$/, "");
  }
  return "";
}
