import { getLocaleFromCookies } from "@/app/actions/locale";
import { getMessages } from "@/lib/i18n";
import type { LocaleCode } from "@/lib/countries";

export interface LocaleContextValue {
  countryCode: string;
  localeCode: LocaleCode;
  messages: Record<string, unknown>;
}

export async function getLocaleContext(): Promise<LocaleContextValue> {
  const { countryCode, localeCode } = await getLocaleFromCookies();
  const messages = await getMessages(localeCode);
  return { countryCode, localeCode, messages };
}
