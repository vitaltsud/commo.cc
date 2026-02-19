import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getLocaleContext } from "@/components/LocaleProvider";
import { LocaleProvider } from "@/components/LocaleContext";
import { getCountryByCode, getContentLocalesForCountry, defaultCountryCode } from "@/lib/countries";
import { getBaseUrl, getAlternateUrls, pathSuffixFromInternalPath } from "@/lib/hreflang";
import type { CountryCode, LocaleCode } from "@/lib/countries";
import type { Metadata } from "next";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ country: string; lang: string }>;
};

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { country, lang } = await params;
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? `/${country}/${lang}`;
  const suffix = pathSuffixFromInternalPath(pathname, country, lang);
  const base = getBaseUrl().replace(/\/$/, "");
  const pathPart = suffix ? `/${suffix}` : "";
  const canonical = `${base}/${country}/${lang}${pathPart}`;
  const languages = getAlternateUrls(suffix);
  return {
    alternates: {
      canonical,
      languages: {
        "x-default": canonical,
        ...languages,
      },
    },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { country: countryParam, lang: langParam } = await params;
  const countryCode = (countryParam || defaultCountryCode) as CountryCode;
  const country = getCountryByCode(countryCode);
  const validCountry = country ? countryCode : defaultCountryCode;
  const locales = getContentLocalesForCountry(validCountry as CountryCode);
  const validLang = (locales.includes(langParam as LocaleCode) ? langParam : locales[0]) as LocaleCode;

  if (countryParam !== validCountry || langParam !== validLang) {
    redirect(`/${validCountry}/${validLang}`);
  }

  const localeState = await getLocaleContext({ country: validCountry, lang: validLang });
  return <LocaleProvider value={localeState}>{children}</LocaleProvider>;
}
