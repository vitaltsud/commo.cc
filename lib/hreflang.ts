/**
 * Hreflang by standard (BCP 47: language-Region).
 * https://developers.google.com/search/docs/specialty/international/localized-versions
 */

import { getValidLocaleSegments, parseLocaleSegment } from "@/lib/locale-format";
import { getContentLocalesForCountry, getDefaultLangForCountry } from "@/lib/countries";
import type { LocaleCode } from "@/lib/countries";
import { isCitySlug } from "@/lib/city-slugs";

const COUNTRY_TO_REGION: Record<string, string> = {
  pl: "PL",
  ua: "UA",
  de: "DE",
  gb: "GB",
  us: "US",
  ca: "CA",
  al: "AL",
  me: "ME",
  bg: "BG",
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

/** All alternate URLs. New order: default lang /country/city/suffix, non-default /country/lang/city/suffix. */
export function getAlternateUrls(pathSuffix: string, citySlug?: string | null): Record<string, string> {
  const base = getBaseUrl().replace(/\/$/, "");
  const suffix = pathSuffix ? (pathSuffix.startsWith("/") ? pathSuffix : `/${pathSuffix}`) : "";
  const cityPart = citySlug ? `/${citySlug}` : "";
  const segments = getValidLocaleSegments();
  const out: Record<string, string> = {};
  for (const seg of segments) {
    const parsed = parseLocaleSegment(seg);
    if (!parsed) continue;
    const hreflang = localeSegmentToHreflang(seg);
    const defaultLang = getDefaultLangForCountry(parsed.country);
    const path = parsed.lang === defaultLang
      ? `/${parsed.country}${cityPart}${suffix}`
      : `/${parsed.country}/${parsed.lang}${cityPart}${suffix}`;
    out[hreflang] = `${base}${path}`;
  }
  return out;
}

/** Path suffix from pathname. New order: /country/city/rest, /country/lang/city/rest, /country/lang/rest. */
export function pathSuffixFromInternalPath(pathname: string, country: string, lang: string): string {
  const segs = pathname.replace(/\/$/, "").split("/").filter(Boolean);
  if (segs[0] !== country || segs.length < 2) return "";
  const contentLocales = getContentLocalesForCountry(country);
  const second = segs[1];
  if (contentLocales.includes(second as LocaleCode)) {
    const third = segs[2];
    if (third && isCitySlug(country, third)) return (segs.slice(3).join("/") ?? "").replace(/\/$/, "");
    return (segs.slice(2).join("/") ?? "").replace(/\/$/, "");
  }
  if (second && isCitySlug(country, second)) return (segs.slice(2).join("/") ?? "").replace(/\/$/, "");
  return (segs.slice(1).join("/") ?? "").replace(/\/$/, "");
}
