/**
 * Global catalog: each country has its own content locales and optionally
 * a subset of active service categories. User sees only data for selected country.
 */

export const COUNTRY_COOKIE = "commo_country";
export const LOCALE_COOKIE = "commo_locale";

export type CountryCode = string;
export type LocaleCode = "en" | "pl" | "ru" | "uk" | "de" | "fr" | "es" | "it" | "sq" | "bg" | "sr";

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
    contentLocales: ["de", "en", "ru", "uk"],
    activeCategoryIds: [],
  },
  {
    code: "gb",
    nativeName: "United Kingdom",
    name: { en: "United Kingdom", pl: "Wielka Brytania", ru: "Великобритания", uk: "Великобританія", de: "Vereinigtes Königreich", fr: "Royaume-Uni" },
    contentLocales: ["en", "ru", "uk"],
    activeCategoryIds: [],
  },
  {
    code: "us",
    nativeName: "United States",
    name: { en: "United States", pl: "Stany Zjednoczone", ru: "США", uk: "США", de: "Vereinigte Staaten", fr: "États-Unis" },
    contentLocales: ["en", "es", "ru", "uk"],
    activeCategoryIds: [],
  },
  {
    code: "ca",
    nativeName: "Canada",
    name: { en: "Canada", pl: "Kanada", ru: "Канада", uk: "Канада", de: "Kanada", fr: "Canada", es: "Canadá" },
    contentLocales: ["en", "fr", "ru", "uk"],
    activeCategoryIds: [],
  },
  {
    code: "al",
    nativeName: "Shqipëria",
    name: { en: "Albania", pl: "Albania", ru: "Албания", uk: "Албанія", de: "Albanien", fr: "Albanie", es: "Albania", sq: "Shqipëria" },
    contentLocales: ["sq", "en", "ru", "uk"],
    activeCategoryIds: [],
  },
  {
    code: "me",
    nativeName: "Crna Gora",
    name: { en: "Montenegro", pl: "Czarnogóra", ru: "Черногория", uk: "Чорногорія", de: "Montenegro", fr: "Monténégro", es: "Montenegro", sr: "Crna Gora" },
    contentLocales: ["sr", "en", "ru", "uk"],
    activeCategoryIds: [],
  },
  {
    code: "bg",
    nativeName: "България",
    name: { en: "Bulgaria", pl: "Bułgaria", ru: "Болгария", uk: "Болгарія", de: "Bulgarien", fr: "Bulgarie", es: "Bulgaria", bg: "България" },
    contentLocales: ["bg", "en", "ru", "uk"],
    activeCategoryIds: [],
  },
  {
    code: "it",
    nativeName: "Italia",
    name: { en: "Italy", pl: "Włochy", ru: "Италия", uk: "Італія", de: "Italien", fr: "Italie", es: "Italia", it: "Italia" },
    contentLocales: ["it", "en", "ru", "uk"],
    activeCategoryIds: [],
  },
];

/** Страны в алфавитном порядке по английскому названию (name.en) для единообразного порядка во всех языках. */
export const countriesSortedAlphabetically: CountryConfig[] = [...countries].sort((a, b) =>
  (a.name.en ?? a.nativeName).localeCompare(b.name.en ?? b.nativeName, "en", { sensitivity: "base" })
);

export const defaultCountryCode: CountryCode = "pl";

export function getCountryByCode(code: CountryCode): CountryConfig | undefined {
  return countries.find((c) => c.code === code);
}

/** Название страны на заданном языке (для отображения в текущей локали). */
export function getCountryNameInLocale(country: CountryConfig, localeCode: LocaleCode | string): string {
  const name = country.name[localeCode] ?? country.name.en;
  return name ?? country.nativeName;
}

export function getContentLocalesForCountry(countryCode: CountryCode): LocaleCode[] {
  const country = getCountryByCode(countryCode);
  return country?.contentLocales ?? ["en"];
}

/** Языки для отображения: нативный первый, затем английский (если не нативный), остальные по алфавиту. */
export function getContentLocalesForCountrySorted(countryCode: CountryCode): LocaleCode[] {
  const locales = getContentLocalesForCountry(countryCode);
  if (locales.length <= 1) return [...locales];
  const native = locales[0];
  const rest = locales.slice(1);
  const hasEn = rest.includes("en");
  const others = rest.filter((l) => l !== "en").sort((a, b) => a.localeCompare(b));
  return [native, ...(hasEn ? (["en"] as LocaleCode[]) : []), ...others];
}

/** То же для массива (первый элемент = нативный). Используется для карточек стран на главной. */
export function sortContentLocalesForDisplay(locales: LocaleCode[]): LocaleCode[] {
  if (locales.length <= 1) return [...locales];
  const native = locales[0];
  const rest = locales.slice(1);
  const hasEn = rest.includes("en");
  const others = rest.filter((l) => l !== "en").sort((a, b) => a.localeCompare(b));
  return [native, ...(hasEn ? (["en"] as LocaleCode[]) : []), ...others];
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
