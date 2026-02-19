"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { COUNTRY_COOKIE, LOCALE_COOKIE, getContentLocalesForCountry, getCountryByCode } from "@/lib/countries";
import type { CountryCode, LocaleCode } from "@/lib/countries";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export async function setCountry(countryCode: CountryCode) {
  const country = getCountryByCode(countryCode);
  if (!country) return;
  const cookieStore = await cookies();
  cookieStore.set(COUNTRY_COOKIE, countryCode, { path: "/", maxAge: COOKIE_MAX_AGE, sameSite: "lax" });
  const currentLocale = cookieStore.get(LOCALE_COOKIE)?.value as LocaleCode | undefined;
  const locales = getContentLocalesForCountry(countryCode);
  if (currentLocale && !locales.includes(currentLocale)) {
    cookieStore.set(LOCALE_COOKIE, locales[0], { path: "/", maxAge: COOKIE_MAX_AGE, sameSite: "lax" });
  }
  revalidatePath("/", "layout");
}

export async function setLocale(localeCode: LocaleCode) {
  const cookieStore = await cookies();
  const countryCode = (cookieStore.get(COUNTRY_COOKIE)?.value || "pl") as CountryCode;
  const locales = getContentLocalesForCountry(countryCode);
  if (!locales.includes(localeCode)) return;
  cookieStore.set(LOCALE_COOKIE, localeCode, { path: "/", maxAge: COOKIE_MAX_AGE, sameSite: "lax" });
  revalidatePath("/", "layout");
}

export async function getLocaleFromCookies(): Promise<{ countryCode: CountryCode; localeCode: LocaleCode }> {
  const cookieStore = await cookies();
  const countryCode = (cookieStore.get(COUNTRY_COOKIE)?.value || "pl") as CountryCode;
  const country = getCountryByCode(countryCode);
  const locales = country ? country.contentLocales : ["en"];
  const localeCode = (cookieStore.get(LOCALE_COOKIE)?.value || locales[0]) as LocaleCode;
  const validLocale = (locales.includes(localeCode) ? localeCode : locales[0]) as LocaleCode;
  return { countryCode, localeCode: validLocale };
}
