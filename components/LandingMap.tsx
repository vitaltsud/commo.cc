"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { countries } from "@/lib/countries";
import { getEnglishLocaleForCountry } from "@/lib/locale-format";

/** [longitude, latitude] — центр страны для маркера */
const COUNTRY_COORDS: Record<string, [number, number]> = {
  pl: [19.4, 52.1],
  ua: [31.4, 49.0],
  de: [10.5, 51.2],
  gb: [-2.5, 54.0],
  us: [-95.7, 37.6],
};

const GEO_URL =
  "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

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

export function LandingMap() {
  return (
    <section className="w-full max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold text-graphite text-center mb-6">
        Choose your country
      </h2>
      <div className="relative w-full aspect-[2/1] rounded-xl overflow-hidden border border-gray-200 bg-slate-50">
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
            const href = getEnglishLocaleForCountry(c.code);
            if (!coords || !href) return null;
            return (
              <Marker key={c.code} coordinates={coords}>
                <Link
                  href={`/${href}`}
                  className="block w-4 h-4 -ml-2 -mt-2 rounded-full bg-accent border-2 border-white shadow-md hover:scale-125 hover:bg-accent/90 transition-transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
                  title={c.nativeName}
                  aria-label={`${c.nativeName} — open marketplace`}
                />
              </Marker>
            );
          })}
        </ComposableMap>
      </div>
      <p className="text-center text-sm text-gray-500 mt-3">
        Click a country to open the marketplace in that region (English).
      </p>
    </section>
  );
}
