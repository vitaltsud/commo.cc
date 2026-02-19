import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getValidLocaleSegments, parseLocaleSegment } from "@/lib/locale-format";

const LOCALE_HEADER = "x-next-locale";
const PATHNAME_HEADER = "x-pathname";
const DEFAULT_LOCALE = "/pl/pl";
const VALID_LOCALE_SEGMENTS = getValidLocaleSegments();

/** SEO locale URLs: /country/lang/... (GEO first, then language). Legacy /en_pl/ → 301 to /pl/en/. */
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const search = request.nextUrl.search;

  // Redirect legacy /en_pl/ or /en_pl/signin → /pl/en/ or /pl/en/signin (canonical: country then lang)
  const firstSegment = pathname.split("/").filter(Boolean)[0]?.toLowerCase();
  if (firstSegment && VALID_LOCALE_SEGMENTS.includes(firstSegment)) {
    const parsed = parseLocaleSegment(firstSegment);
    if (parsed) {
      const segments = pathname.split("/").filter(Boolean);
      const rest = segments.slice(1).join("/");
      const canonical = `/${parsed.country}/${parsed.lang}${rest ? `/${rest}` : ""}`;
      return NextResponse.redirect(new URL(canonical + search, request.url), 301);
    }
  }

  // Legacy paths without locale -> redirect to default locale (e.g. /signin -> /pl/pl/signin)
  const legacyPaths = ["signin", "settings", "for-pros", "how-it-works", "search"];
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 1 && legacyPaths.includes(segments[0])) {
    return NextResponse.redirect(new URL(`${DEFAULT_LOCALE}/${segments[0]}${search}`, request.url));
  }

  // ЧПУ: /country/lang/search?category=cleaning -> /country/lang/search/cleaning
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
