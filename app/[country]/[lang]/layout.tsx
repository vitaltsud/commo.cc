import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getLocaleContext } from "@/components/LocaleProvider";
import { LocaleProvider } from "@/components/LocaleContext";
import { ViewModeProvider } from "@/components/ViewModeContext";
import { Footer } from "@/components/Footer";
import { getCountryByCode, getContentLocalesForCountry, getDefaultLangForCountry, defaultCountryCode } from "@/lib/countries";
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
  const citySlug = headersList.get("x-city") ?? null;
  const suffix = pathSuffixFromInternalPath(pathname, country, lang);
  const base = getBaseUrl().replace(/\/$/, "");
  const canonical = `${base}${pathname.startsWith("/") ? pathname : `/${pathname}`}`.replace(/\/$/, "") || `${base}/${country}`;
  const languages = getAlternateUrls(suffix, citySlug);
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

  const headersList = await headers();
  const citySlug = headersList.get("x-city") ?? null;

  if (countryParam !== validCountry || langParam !== validLang) {
    const defLang = getDefaultLangForCountry(validCountry as CountryCode);
    const cityPart = citySlug ? `/${citySlug}` : "";
    const to = validLang === defLang ? `/${validCountry}${cityPart}` : `/${validCountry}${cityPart}/${validLang}`;
    redirect(to);
  }

  const localeState = await getLocaleContext({ country: validCountry, lang: validLang, citySlug });
  return (
    <LocaleProvider value={localeState}>
      <ViewModeProvider>
        <div className="min-h-screen flex flex-col w-full">
          {children}
          <Footer />
        </div>
      </ViewModeProvider>
    </LocaleProvider>
  );
}
