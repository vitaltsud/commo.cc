"use client";

import { usePathname } from "next/navigation";
import { useLocale } from "./LocaleContext";
import { setCountry } from "@/app/actions/locale";
import { getNested } from "@/lib/i18n";
import { countries } from "@/lib/countries";

/** Path without locale prefix: /pl/pl/settings -> "settings", /pl/pl -> "" */
function pathWithoutLocale(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  return segments.slice(2).join("/") ?? "";
}

export function CountrySelect() {
  const pathname = usePathname();
  const { countryCode, messages } = useLocale();
  const label = getNested(messages, "country.label") ?? "Country";

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const code = e.target.value as string;
    if (!code) return;
    await setCountry(code, pathWithoutLocale(pathname));
  }

  return (
    <label className="flex items-center gap-2 text-sm text-graphite">
      <span className="sr-only">{label}</span>
      <select
        value={countryCode}
        onChange={handleChange}
        className="border border-gray-300 rounded px-2 py-1 text-graphite bg-white focus:outline-none focus:ring-2 focus:ring-accent"
        aria-label={label}
      >
        {countries.map((c) => (
          <option key={c.code} value={c.code}>
            {c.nativeName}
          </option>
        ))}
      </select>
    </label>
  );
}
