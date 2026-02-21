import { LandingContent } from "@/components/LandingContent";
import { LocaleProvider } from "@/components/LocaleContext";
import { getBaseUrl } from "@/lib/hreflang";
import { getMessages } from "@/lib/i18n";
import type { LocaleCode } from "@/lib/countries";
import type { Metadata } from "next";

const LANDING_LOCALES: LocaleCode[] = ["en", "pl", "ru", "uk", "de", "es", "it"];

function isValidLandingLocale(lang: string | undefined): lang is LocaleCode {
  return !!lang && LANDING_LOCALES.includes(lang as LocaleCode);
}

export const metadata: Metadata = {
  alternates: {
    canonical: `${getBaseUrl().replace(/\/$/, "")}/`,
  },
};

type PageProps = { searchParams: Promise<{ lang?: string }> };

export default async function RootPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const localeCode = isValidLandingLocale(params.lang) ? (params.lang as LocaleCode) : "en";
  const messages = await getMessages(localeCode);
  const localeState = {
    countryCode: "pl",
    localeCode,
    citySlug: null as string | null,
    messages,
  };
  return (
    <LocaleProvider value={localeState}>
      <LandingContent />
    </LocaleProvider>
  );
}
