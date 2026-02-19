/**
 * Hreflang by standard (BCP 47: language-Region).
 * https://developers.google.com/search/docs/specialty/international/localized-versions
 */

import { getValidLocaleSegments, parseLocaleSegment } from "@/lib/locale-format";
import { getContentLocalesForCountry, getDefaultLangForCountry } from "@/lib/countries";

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

/** All alternate URLs. Default lang: /country/suffix; non-default: /country/lang/suffix. */
export function getAlternateUrls(pathSuffix: string): Record<string, string> {
  const base = getBaseUrl().replace(/\/$/, "");
  const suffix = pathSuffix ? (pathSuffix.startsWith("/") ? pathSuffix : `/${pathSuffix}`) : "";
  const segments = getValidLocaleSegments();
  const out: Record<string, string> = {};
  for (const seg of segments) {
    const parsed = parseLocaleSegment(seg);
    if (!parsed) continue;
    const hreflang = localeSegmentToHreflang(seg);
    const defaultLang = getDefaultLangForCountry(parsed.country);
    const path = parsed.lang === defaultLang
      ? `/${parsed.country}${suffix}`
      : `/${parsed.country}/${parsed.lang}${suffix}`;
    out[hreflang] = `${base}${path}`;
  }
  return out;
}

/** Path suffix from pathname. Supports /country/ (default lang) and /country/lang/... (non-default). */
export function pathSuffixFromInternalPath(pathname: string, country: string, lang: string): string {
  const segs = pathname.replace(/\/$/, "").split("/").filter(Boolean);
  if (segs[0] !== country || segs.length < 2) return "";
  const contentLocales = getContentLocalesForCountry(country);
  const second = segs[1];
  if (contentLocales.includes(second as "en" | "pl" | "ru" | "uk" | "de" | "fr" | "es")) {
    return segs.slice(2).join("/").replace(/\/$/, "");
  }
  return segs.slice(1).join("/").replace(/\/$/, "");
}
