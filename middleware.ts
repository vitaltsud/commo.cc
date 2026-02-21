import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getValidLocaleSegments, parseLocaleSegment } from "@/lib/locale-format";
import { getCountryByCode, getContentLocalesForCountry, getDefaultLangForCountry } from "@/lib/countries";
import type { LocaleCode } from "@/lib/countries";
import { isCitySlug } from "@/lib/city-slugs";

const LOCALE_HEADER = "x-next-locale";
const PATHNAME_HEADER = "x-pathname";
const CITY_HEADER = "x-city";
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
  const legacyPaths = ["signin", "settings", "for-pros", "how-it-works", "search", "my-projects", "pro"];
  if (segments.length === 1 && legacyPaths.includes(segments[0])) {
    return NextResponse.redirect(new URL(`/${DEFAULT_COUNTRY}/${segments[0]}${search}`, request.url));
  }

  // New URL order: /country/, /country/city/..., /country/lang/..., /country/lang/city/..., /country/contractor/hash
  if (segments.length >= 1 && getCountryByCode(segments[0])) {
    const country = segments[0];
    const defaultLang = getDefaultLangForCountry(country);
    const contentLocales = getContentLocalesForCountry(country);
    const second = segments[1];

    if (segments.length === 1) {
      const url = request.nextUrl.clone();
      url.pathname = `/${country}/${defaultLang}`;
      const res = NextResponse.rewrite(url);
      res.headers.set(LOCALE_HEADER, defaultLang);
      res.headers.set(PATHNAME_HEADER, `/${country}`);
      return res;
    }

    const isSecondLang = contentLocales.includes(second as LocaleCode);
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set(PATHNAME_HEADER, pathname);

    if (isSecondLang) {
      const lang = second;
      const restSegments = segments.slice(2);
      const rest = restSegments.join("/");
      // Redirect old URL format: /country/lang/city/projects/cat → /country/lang/projects/cat/city
      if (restSegments.length >= 3) {
        const maybeCity = restSegments[0];
        const maybeProjects = restSegments[1];
        const maybeCategory = restSegments[2];
        if (
          isCitySlug(country, maybeCity) &&
          (maybeProjects === "projects" || maybeProjects === "contractors") &&
          maybeCategory
        ) {
          const newPath = `/${country}/${lang}/${maybeProjects}/${maybeCategory}/${maybeCity}`;
          return NextResponse.redirect(new URL(newPath + search, request.url), 301);
        }
      }
      // New format: city at end for projects/contractors — set x-city from last segment; or single segment = city (e.g. /pl/ru/warsaw); or city/projects, city/contractors
      let cityFromPath: string | null = null;
      if (
        (rest.startsWith("projects/") || rest.startsWith("contractors/")) &&
        restSegments.length >= 3
      ) {
        const lastSegment = restSegments[restSegments.length - 1];
        if (isCitySlug(country, lastSegment)) cityFromPath = lastSegment;
      } else if (restSegments.length === 1 && isCitySlug(country, restSegments[0])) {
        cityFromPath = restSegments[0];
      } else if (
        restSegments.length >= 2 &&
        isCitySlug(country, restSegments[0]) &&
        (restSegments[1] === "projects" || restSegments[1] === "contractors")
      ) {
        cityFromPath = restSegments[0];
      }
      const rewritePath = `/${country}/${lang}${rest ? `/${rest}` : ""}`;
      const url = request.nextUrl.clone();
      url.pathname = rewritePath;
      requestHeaders.set(LOCALE_HEADER, lang);
      if (cityFromPath) requestHeaders.set(CITY_HEADER, cityFromPath);
      return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
    }

    // Redirect old format: /country/city/projects/cat → /country/defaultLang/projects/cat/city
    if (isCitySlug(country, second)) {
      const city = second;
      const restSegments = segments.slice(2);
      if (restSegments.length >= 2 && (restSegments[0] === "projects" || restSegments[0] === "contractors")) {
        const type = restSegments[0];
        const category = restSegments[1];
        if (category) {
          const newPath = `/${country}/${defaultLang}/${type}/${category}/${city}`;
          return NextResponse.redirect(new URL(newPath + search, request.url), 301);
        }
      }
      const rest = restSegments.join("/");
      const rewritePath = `/${country}/${defaultLang}${rest ? `/${rest}` : ""}`;
      const url = request.nextUrl.clone();
      url.pathname = rewritePath;
      requestHeaders.set(LOCALE_HEADER, defaultLang);
      requestHeaders.set(CITY_HEADER, city);
      return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
    }

    // Default lang, no city: /pl/contractor/hash, /pl/settings, etc.
    const rewritePath = `/${country}/${defaultLang}/${segments.slice(1).join("/")}`;
    const url = request.nextUrl.clone();
    url.pathname = rewritePath;
    requestHeaders.set(LOCALE_HEADER, defaultLang);
    return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
  }

  const res = NextResponse.next();
  return res;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
