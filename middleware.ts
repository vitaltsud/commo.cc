import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getValidLocaleSegments, parseLocaleSegment } from "@/lib/locale-format";
import { getCountryByCode, getContentLocalesForCountry, getDefaultLangForCountry } from "@/lib/countries";

const LOCALE_HEADER = "x-next-locale";
const PATHNAME_HEADER = "x-pathname";
const DEFAULT_COUNTRY = "pl";
const VALID_LOCALE_SEGMENTS = getValidLocaleSegments();

/** /country/ = default lang; /country/lang/ = non-default only. Legacy /en_pl/ → 301 to /pl/en/. */
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const search = request.nextUrl.search;
  const segments = pathname.split("/").filter(Boolean);

  // Redirect legacy /en_pl/ → /pl/en/
  const firstSegment = segments[0]?.toLowerCase();
  if (firstSegment && VALID_LOCALE_SEGMENTS.includes(firstSegment)) {
    const parsed = parseLocaleSegment(firstSegment);
    if (parsed) {
      const rest = segments.slice(1).join("/");
      const canonical = `/${parsed.country}/${parsed.lang}${rest ? `/${rest}` : ""}`;
      return NextResponse.redirect(new URL(canonical + search, request.url), 301);
    }
  }

  // Legacy single segment (signin, etc.) → /pl/signin (default country; /country/path = default lang)
  const legacyPaths = ["signin", "settings", "for-pros", "how-it-works", "search"];
  if (segments.length === 1 && legacyPaths.includes(segments[0])) {
    return NextResponse.redirect(new URL(`/${DEFAULT_COUNTRY}/${segments[0]}${search}`, request.url));
  }

  // /country/ or /country/rest (default lang): rewrite to /country/defaultLang/ so app serves; set pathname to public URL
  if (segments.length >= 1 && getCountryByCode(segments[0])) {
    const country = segments[0];
    const defaultLang = getDefaultLangForCountry(country);
    const contentLocales = getContentLocalesForCountry(country);

    if (segments.length === 1) {
      const rewrite = `/${country}/${defaultLang}`;
      const url = request.nextUrl.clone();
      url.pathname = rewrite;
      const res = NextResponse.rewrite(url);
      res.headers.set(LOCALE_HEADER, defaultLang);
      res.headers.set(PATHNAME_HEADER, `/${country}`);
      return res;
    }

    const second = segments[1];
    const isContentLang = contentLocales.includes(second as "en" | "pl" | "ru" | "uk" | "de" | "fr" | "es");

    if (isContentLang && second === defaultLang) {
      const rest = segments.slice(2).join("/");
      const canonical = `/${country}${rest ? `/${rest}` : ""}`;
      return NextResponse.redirect(new URL(canonical + search, request.url), 301);
    }

    if (isContentLang) {
      const res = NextResponse.next();
      res.headers.set(LOCALE_HEADER, second);
      res.headers.set(PATHNAME_HEADER, pathname);
      return res;
    }

    const rewrite = `/${country}/${defaultLang}/${segments.slice(1).join("/")}`;
    const url = request.nextUrl.clone();
    url.pathname = rewrite;
    const res = NextResponse.rewrite(url);
    res.headers.set(LOCALE_HEADER, defaultLang);
    res.headers.set(PATHNAME_HEADER, `/${country}/${segments.slice(1).join("/")}`);
    return res;
  }

  // ЧПУ: /country/lang/search?category=cleaning → /country/lang/search/cleaning
  const localeMatch = pathname.match(/^\/([^/]+)\/([^/]+)\/search\/?$/);
  const categoryParam = request.nextUrl.searchParams.get("category");
  if (localeMatch && categoryParam) {
    const [, country, lang] = localeMatch;
    const cleanCategory = categoryParam.replace(/[^a-z0-9-]/gi, "").toLowerCase();
    if (cleanCategory) {
      return NextResponse.redirect(new URL(`/${country}/${lang}/search/${cleanCategory}`, request.url));
    }
  }

  const match = pathname.match(/^\/([^/]+)\/([^/]+)(?:\/|$)/);
  const res = NextResponse.next();
  if (match) {
    const [, _country, lang] = match;
    res.headers.set(LOCALE_HEADER, lang);
    res.headers.set(PATHNAME_HEADER, pathname);
  }
  return res;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
