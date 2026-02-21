"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useLocale } from "./LocaleContext";
import { countries, getCountryNameInLocale } from "@/lib/countries";
import { getEnglishLocaleForCountry, parseLocaleSegment } from "@/lib/locale-format";
import { localePath } from "@/lib/paths";

/** [longitude, latitude] — центр страны для маркера */
const COUNTRY_COORDS: Record<string, [number, number]> = {
  pl: [19.4, 52.1],
  ua: [31.4, 49.0],
  de: [10.5, 51.2],
  gb: [-2.5, 54.0],
  us: [-95.7, 37.6],
};

// Natural Earth GeoJSON (deldersveld topojson URL returns 404)
const GEO_URL =
  "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_countries.geojson";

const ComposableMap = dynamic(
  () => import("react-simple-maps").then((m) => m.ComposableMap),
  { ssr: false }
);
const Geographies = dynamic(
  () => import("react-simple-maps").then((m) => m.Geographies),
  { ssr: false }
);
const Geography = dynamic(
  () => import("react-simple-maps").then((m) => m.Geography),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-simple-maps").then((m) => m.Marker),
  { ssr: false }
);
const Sphere = dynamic(
  () => import("react-simple-maps").then((m) => m.Sphere),
  { ssr: false }
);

function flagEmoji(code: string): string {
  return code
    .toUpperCase()
    .replace(/./g, (c) => String.fromCodePoint(0x1f1e6 - 65 + c.charCodeAt(0)));
}

export function LandingMap() {
  const { localeCode } = useLocale();
  return (
    <section className="w-full max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold text-graphite text-center mb-6">
        Choose your country
      </h2>
      <div className="flex flex-col md:flex-row gap-6 items-stretch">
        <div className="relative flex-1 min-w-0 aspect-[2/1] md:aspect-auto md:min-h-[320px] rounded-xl overflow-hidden border border-gray-200 bg-slate-50">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 120,
            center: [20, 45],
          }}
          width={800}
          height={400}
          style={{ width: "100%", height: "auto" }}
        >
          <Sphere id="sphere" fill="#e8eef4" stroke="#cbd5e1" />
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#d1d5db"
                  stroke="#9ca3af"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover: { fill: "#e5e7eb", outline: "none" },
                    pressed: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>
          {countries.map((c) => {
            const coords = COUNTRY_COORDS[c.code];
            const seg = getEnglishLocaleForCountry(c.code);
            const parsed = seg ? parseLocaleSegment(seg) : null;
            const href = parsed ? localePath(parsed.country, parsed.lang) : null;
            if (!coords || !href) return null;
            return (
              <Marker key={c.code} coordinates={coords}>
                <Link
                  href={href}
                  className="block w-4 h-4 -ml-2 -mt-2 rounded-full bg-accent border-2 border-white shadow-md hover:scale-125 hover:bg-accent/90 transition-transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
                  title={getCountryNameInLocale(c, localeCode)}
                  aria-label={`${getCountryNameInLocale(c, localeCode)} — open marketplace`}
                />
              </Marker>
            );
          })}
        </ComposableMap>
        </div>
        <ul className="flex flex-col gap-2 md:min-w-[200px] md:justify-center shrink-0 border border-gray-200 rounded-xl bg-slate-50 p-4">
          {countries.map((c) => {
            const seg = getEnglishLocaleForCountry(c.code);
            const parsed = seg ? parseLocaleSegment(seg) : null;
            const href = parsed ? localePath(parsed.country, parsed.lang) : null;
            if (!href) return null;
            return (
              <li key={c.code}>
                <Link
                  href={href}
                  className="flex items-center gap-3 py-2 px-3 rounded-lg text-graphite hover:bg-white hover:shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
                  aria-label={`${getCountryNameInLocale(c, localeCode)} — open marketplace`}
                >
                  <span className="text-2xl leading-none" aria-hidden>
                    {flagEmoji(c.code)}
                  </span>
                  <span className="font-medium">{getCountryNameInLocale(c, localeCode)}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <p className="text-center text-sm text-gray-500 mt-3">
        Click a country or the map to open the marketplace (English).
      </p>
    </section>
  );
}
