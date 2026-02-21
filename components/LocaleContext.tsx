"use client";

import { createContext, useContext } from "react";
import { translate, type TranslateOptions } from "@/lib/i18n";
import { localePath } from "@/lib/paths";
import type { LocaleCode } from "@/lib/countries";

export interface LocaleState {
  countryCode: string;
  localeCode: LocaleCode;
  citySlug: string | null;
  messages: Record<string, unknown>;
}

const defaultState: LocaleState = {
  countryCode: "pl",
  localeCode: "en",
  citySlug: null,
  messages: {},
};

const LocaleContext = createContext<LocaleState>(defaultState);

export function LocaleProvider({
  value,
  children,
}: {
  value: LocaleState;
  children: React.ReactNode;
}) {
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  return useContext(LocaleContext);
}

/**
 * t(key) — plain string.
 * t(key, { count: n }) — plural; key must be a plural object in JSON (one, few, many, other).
 * t(key, { count: n, name: "..." }) — plural + interpolation ({{count}}, {{name}}).
 */
export function useT() {
  const { messages, localeCode } = useLocale();
  return (path: string, options?: TranslateOptions): string =>
    translate(messages, path, localeCode, options) || path;
}

/** Build locale-prefixed URL for current country/lang (and city if set): path("") => "/pl/warsaw" or "/pl/pl" */
export function useLocalePath() {
  const { countryCode, localeCode, citySlug } = useLocale();
  return (path: string = "") => localePath(countryCode, localeCode, path, citySlug);
}
