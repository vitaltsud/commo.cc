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
  /** Name of the country in its own language (for dropdown and display) */
  nativeName: string;
  name: Record<string, string>;
  /** Content languages available in this country (UI + content) */
  contentLocales: LocaleCode[];
  /** Categories active in this country (empty = all active) */
  activeCategoryIds: string[];
}

export const countries: CountryConfig[] = [
  {
    code: "pl",
    nativeName: "Polska",
    name: { en: "Poland", pl: "Polska", ru: "Польша", uk: "Польща", de: "Polen", fr: "Pologne" },
    contentLocales: ["pl", "en", "ru", "uk"],
    activeCategoryIds: [], // all
  },
  {
    code: "ua",
    nativeName: "Україна",
    name: { en: "Ukraine", pl: "Ukraina", ru: "Украина", uk: "Україна", de: "Ukraine", fr: "Ukraine" },
    contentLocales: ["uk", "en", "ru", "pl"],
    activeCategoryIds: [],
  },
  {
    code: "de",
    nativeName: "Deutschland",
    name: { en: "Germany", pl: "Niemcy", ru: "Германия", uk: "Німеччина", de: "Deutschland", fr: "Allemagne" },
    contentLocales: ["de", "en"],
    activeCategoryIds: [],
  },
  {
    code: "gb",
    nativeName: "United Kingdom",
    name: { en: "United Kingdom", pl: "Wielka Brytania", ru: "Великобритания", uk: "Великобританія", de: "Vereinigtes Königreich", fr: "Royaume-Uni" },
    contentLocales: ["en"],
    activeCategoryIds: [],
  },
  {
    code: "us",
    nativeName: "United States",
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

/** Default (first) content language for the country. Used for /country/ (one segment). */
export function getDefaultLangForCountry(countryCode: CountryCode): LocaleCode {
  const locales = getContentLocalesForCountry(countryCode);
  return (locales[0] ?? "en") as LocaleCode;
}

export function getActiveCategoryIdsForCountry(countryCode: CountryCode): string[] {
  const country = getCountryByCode(countryCode);
  return country?.activeCategoryIds ?? [];
}
