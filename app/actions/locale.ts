"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { COUNTRY_COOKIE, LOCALE_COOKIE, getContentLocalesForCountry, getCountryByCode } from "@/lib/countries";
import { localePath } from "@/lib/paths";
import { isCitySlug } from "@/lib/city-slugs";
import type { CountryCode, LocaleCode } from "@/lib/countries";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

/** Switch country: set cookie and redirect to /country/lang/path or /country/city/lang/path (SEO). */
export async function setCountry(countryCode: CountryCode, currentPath: string = "", citySlug?: string | null) {
  const country = getCountryByCode(countryCode);
  if (!country) return;
  const safeCity = citySlug && isCitySlug(countryCode, citySlug) ? citySlug : undefined;
  const cookieStore = await cookies();
  cookieStore.set(COUNTRY_COOKIE, countryCode, { path: "/", maxAge: COOKIE_MAX_AGE, sameSite: "lax" });
  const locales = getContentLocalesForCountry(countryCode);
  const lang = locales[0];
  cookieStore.set(LOCALE_COOKIE, lang, { path: "/", maxAge: COOKIE_MAX_AGE, sameSite: "lax" });
  redirect(localePath(countryCode, lang, currentPath, safeCity));
}

/** Switch language: set cookie and redirect to /country/lang/path or /country/city/lang/path (SEO). */
export async function setLocale(localeCode: LocaleCode, currentPath: string = "", citySlug?: string | null) {
  const cookieStore = await cookies();
  const countryCode = (cookieStore.get(COUNTRY_COOKIE)?.value || "pl") as CountryCode;
  const locales = getContentLocalesForCountry(countryCode);
  if (!locales.includes(localeCode)) return;
  const safeCity = citySlug && isCitySlug(countryCode, citySlug) ? citySlug : undefined;
  cookieStore.set(LOCALE_COOKIE, localeCode, { path: "/", maxAge: COOKIE_MAX_AGE, sameSite: "lax" });
  redirect(localePath(countryCode, localeCode, currentPath, safeCity));
}

/** Switch city: redirect to /country/city/ or /country/city/lang/... (SEO). Pass "" to clear city. */
export async function setCity(citySlug: string | null, currentPath: string = "") {
  const cookieStore = await cookies();
  const countryCode = (cookieStore.get(COUNTRY_COOKIE)?.value || "pl") as CountryCode;
  const lang = (cookieStore.get(LOCALE_COOKIE)?.value || "en") as LocaleCode;
  const safeCity = citySlug && isCitySlug(countryCode, citySlug) ? citySlug : null;
  redirect(localePath(countryCode, lang, currentPath, safeCity ?? undefined));
}
