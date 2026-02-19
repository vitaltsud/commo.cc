"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { COUNTRY_COOKIE, LOCALE_COOKIE, getContentLocalesForCountry, getCountryByCode } from "@/lib/countries";
import { localePath } from "@/lib/paths";
import type { CountryCode, LocaleCode } from "@/lib/countries";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

/** Switch country: set cookie and redirect to /country/lang/path (SEO locale URL). */
export async function setCountry(countryCode: CountryCode, currentPath: string = "") {
  const country = getCountryByCode(countryCode);
  if (!country) return;
  const cookieStore = await cookies();
  cookieStore.set(COUNTRY_COOKIE, countryCode, { path: "/", maxAge: COOKIE_MAX_AGE, sameSite: "lax" });
  const locales = getContentLocalesForCountry(countryCode);
  const lang = locales[0];
  cookieStore.set(LOCALE_COOKIE, lang, { path: "/", maxAge: COOKIE_MAX_AGE, sameSite: "lax" });
  redirect(localePath(countryCode, lang, currentPath));
}

/** Switch language: set cookie and redirect to /country/lang/path (SEO locale URL). */
export async function setLocale(localeCode: LocaleCode, currentPath: string = "") {
  const cookieStore = await cookies();
  const countryCode = (cookieStore.get(COUNTRY_COOKIE)?.value || "pl") as CountryCode;
  const locales = getContentLocalesForCountry(countryCode);
  if (!locales.includes(localeCode)) return;
  cookieStore.set(LOCALE_COOKIE, localeCode, { path: "/", maxAge: COOKIE_MAX_AGE, sameSite: "lax" });
  redirect(localePath(countryCode, localeCode, currentPath));
}
