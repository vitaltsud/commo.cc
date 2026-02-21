import { getMessages } from "@/lib/i18n";
import {
  getCountryByCode,
  getContentLocalesForCountry,
  defaultCountryCode,
  type CountryCode,
  type LocaleCode,
} from "@/lib/countries";

export interface LocaleContextValue {
  countryCode: string;
  localeCode: LocaleCode;
  citySlug: string | null;
  messages: Record<string, unknown>;
}

export type LocaleParams = { country: string; lang: string; citySlug?: string | null };

/** Build locale context from URL params (e.g. /pl/pl/ or /pl/warsaw/). Invalid params fallback to default. */
export async function getLocaleContext(params: LocaleParams): Promise<LocaleContextValue> {
  const countryCode = (params.country || defaultCountryCode) as CountryCode;
  const country = getCountryByCode(countryCode);
  const validCountry = country ? countryCode : defaultCountryCode;
  const locales = getContentLocalesForCountry(validCountry as CountryCode);
  const langParam = (params.lang || locales[0]) as LocaleCode;
  const localeCode = locales.includes(langParam) ? langParam : locales[0];
  const messages = await getMessages(localeCode);
  return {
    countryCode: validCountry,
    localeCode,
    citySlug: params.citySlug ?? null,
    messages,
  };
}
