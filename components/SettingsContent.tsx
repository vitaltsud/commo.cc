"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";
import { useLocale, useT } from "./LocaleContext";
import { setCountry } from "@/app/actions/locale";
import { countries, getContentLocalesForCountry } from "@/lib/countries";
import { localeNamesNative } from "@/lib/locales";
import type { LocaleCode } from "@/lib/countries";

// In real app: load/save from API. For now we only persist country via cookie; communication languages in state/localStorage.
const STORAGE_KEY = "commo_communication_languages";

function getStoredLanguages(): LocaleCode[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as string[];
    return Array.isArray(arr) ? arr.filter((x): x is LocaleCode => ["en", "pl", "ru", "uk", "de", "fr", "es"].includes(x)) : [];
  } catch {
    return [];
  }
}

function setStoredLanguages(locales: LocaleCode[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(locales));
}

function pathWithoutLocale(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  return segments.slice(2).join("/") ?? "";
}

export function SettingsContent() {
  const t = useT();
  const pathname = usePathname();
  const { countryCode } = useLocale();
  const [selectedCountry, setSelectedCountry] = useState(countryCode);
  const [communicationLangs, setCommunicationLangs] = useState<LocaleCode[]>([]);
  const [mounted, setMounted] = useState(false);
  const availableForCountry = getContentLocalesForCountry(selectedCountry);

  useEffect(() => {
    setCommunicationLangs(getStoredLanguages());
    setMounted(true);
  }, []);
  useEffect(() => {
    if (mounted) setSelectedCountry(countryCode);
  }, [mounted, countryCode]);

  const handleSaveCountry = async () => {
    setStoredLanguages(communicationLangs);
    await setCountry(selectedCountry, pathWithoutLocale(pathname));
  };

  const toggleCommLang = (loc: LocaleCode) => {
    const next = communicationLangs.includes(loc)
      ? communicationLangs.filter((l) => l !== loc)
      : [...communicationLangs, loc];
    setCommunicationLangs(next);
    setStoredLanguages(next);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-semibold text-graphite mb-8">{t("settings.title")}</h1>

        <section className="mb-8">
          <h2 className="text-lg font-medium text-graphite mb-2">{t("settings.country")}</h2>
          <p className="text-sm text-gray-500 mb-3">{t("settings.countryHelp")}</p>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full max-w-xs border border-gray-300 rounded-lg px-3 py-2 text-graphite"
          >
            {countries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.nativeName}
              </option>
            ))}
          </select>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-medium text-graphite mb-2">{t("settings.communicationLanguages")}</h2>
          <p className="text-sm text-gray-500 mb-3">{t("settings.communicationLanguagesHelp")}</p>
          <div className="flex flex-wrap gap-2">
            {availableForCountry.map((loc) => (
              <label key={loc} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={communicationLangs.includes(loc)}
                  onChange={() => toggleCommLang(loc)}
                  className="rounded border-gray-300 text-accent focus:ring-accent"
                />
                <span className="text-graphite">{localeNamesNative[loc] ?? loc}</span>
              </label>
            ))}
          </div>
        </section>

        <button
          type="button"
          onClick={handleSaveCountry}
          className="px-4 py-2 rounded-lg bg-graphite text-white font-medium hover:bg-graphite/90"
        >
          {t("settings.save")}
        </button>
      </main>
    </div>
  );
}
