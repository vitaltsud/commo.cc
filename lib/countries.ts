/**
 * Global catalog: each country has its own content locales and optionally
 * a subset of active service categories. User sees only data for selected country.
 */

export const COUNTRY_COOKIE = "commo_country";
export const LOCALE_COOKIE = "commo_locale";

export type CountryCode = string;
export type LocaleCode = "en" | "pl" | "ru" | "uk" | "de" | "fr" | "es";

export interface CountryConfig {
  code: CountryCode;
  name: Record<string, string>;
  /** Content languages available in this country (UI + content) */
  contentLocales: LocaleCode[];
  /** Categories active in this country (empty = all active) */
  activeCategoryIds: string[];
}

export const countries: CountryConfig[] = [
  {
    code: "pl",
    name: { en: "Poland", pl: "Polska", ru: "Польша", uk: "Польща", de: "Polen", fr: "Pologne" },
    contentLocales: ["pl", "en", "ru", "uk"],
    activeCategoryIds: [], // all
  },
  {
    code: "ua",
    name: { en: "Ukraine", pl: "Ukraina", ru: "Украина", uk: "Україна", de: "Ukraine", fr: "Ukraine" },
    contentLocales: ["uk", "en", "ru", "pl"],
    activeCategoryIds: [],
  },
  {
    code: "de",
    name: { en: "Germany", pl: "Niemcy", ru: "Германия", uk: "Німеччина", de: "Deutschland", fr: "Allemagne" },
    contentLocales: ["de", "en"],
    activeCategoryIds: [],
  },
  {
    code: "gb",
    name: { en: "United Kingdom", pl: "Wielka Brytania", ru: "Великобритания", uk: "Великобританія", de: "Vereinigtes Königreich", fr: "Royaume-Uni" },
    contentLocales: ["en"],
    activeCategoryIds: [],
  },
  {
    code: "us",
    name: { en: "United States", pl: "Stany Zjednoczone", ru: "США", uk: "США", de: "Vereinigte Staaten", fr: "États-Unis" },
    contentLocales: ["en", "es"],
    activeCategoryIds: [],
  },
];

export const defaultCountryCode: CountryCode = "pl";

export function getCountryByCode(code: CountryCode): CountryConfig | undefined {
  return countries.find((c) => c.code === code);
}

export function getContentLocalesForCountry(countryCode: CountryCode): LocaleCode[] {
  const country = getCountryByCode(countryCode);
  return country?.contentLocales ?? ["en"];
}

export function getActiveCategoryIdsForCountry(countryCode: CountryCode): string[] {
  const country = getCountryByCode(countryCode);
  return country?.activeCategoryIds ?? [];
}
