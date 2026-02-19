import type { LocaleCode } from "./countries";
import { getPluralCategory, selectPluralForm, isPluralFormKey } from "./plural-rules";

type Messages = Record<string, unknown>;

const messagesCache: Partial<Record<LocaleCode, Messages>> = {};

/** Deep merge: locale overrides en. Missing or empty strings in locale fall back to en. */
function mergeWithEn(en: Messages, locale: Messages): Messages {
  const out: Messages = {};
  for (const key of Array.from(new Set([...Object.keys(en), ...Object.keys(locale)]))) {
    const enVal = en[key];
    const locVal = locale[key];
    if (locVal != null && typeof locVal === "object" && !Array.isArray(locVal) &&
        enVal != null && typeof enVal === "object" && !Array.isArray(enVal)) {
      out[key] = mergeWithEn(enVal as Messages, locVal as Messages);
    } else if (typeof locVal === "string" && locVal.length > 0) {
      out[key] = locVal;
    } else if (enVal !== undefined) {
      out[key] = enVal;
    }
  }
  return out;
}

/**
 * Returns messages for the locale. English is the source; for other locales
 * missing keys fall back to en.json so the core always has English text.
 */
export async function getMessages(locale: LocaleCode): Promise<Messages> {
  if (messagesCache[locale]) return messagesCache[locale] as Messages;
  const en = (await import("@/messages/en.json")).default as Messages;
  if (locale === "en") {
    messagesCache[locale] = en;
    return en;
  }
  try {
    const m = (await import(`@/messages/${locale}.json`)).default as Messages;
    const merged = mergeWithEn(en, m);
    messagesCache[locale] = merged;
    return merged;
  } catch {
    return en;
  }
}

/** Get value at path (string or object with plural forms). */
export function getNestedValue(obj: unknown, path: string): unknown {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (current == null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[key];
  }
  return current;
}

/** Legacy: string only. Prefer translate() for plural and interpolation. */
export function getNested(obj: unknown, path: string): string | undefined {
  const v = getNestedValue(obj, path);
  return typeof v === "string" ? v : undefined;
}

function isPluralForms(val: unknown): val is Record<string, string> {
  if (val == null || typeof val !== "object" || Array.isArray(val)) return false;
  const o = val as Record<string, unknown>;
  return Object.keys(o).some((k) => isPluralFormKey(k)) && typeof o.other === "string";
}

function interpolate(str: string, vars: Record<string, string | number>): string {
  return str.replace(/\{\{(\w+)\}\}/g, (_, key) => String(vars[key] ?? ""));
}

export interface TranslateOptions {
  count?: number;
  [key: string]: string | number | undefined;
}

/**
 * Resolve message at path: supports plain string or plural object.
 * If options.count is set and the value is a plural object (one/few/many/other),
 * selects the form by locale and interpolates {{count}} and other vars.
 */
export function translate(
  messages: Record<string, unknown>,
  path: string,
  localeCode: LocaleCode,
  options?: TranslateOptions
): string {
  const value = getNestedValue(messages, path);
  const vars = options ? { ...options } as Record<string, string | number> : {};
  if (options?.count !== undefined) vars.count = options.count;

  if (isPluralForms(value)) {
    const category = getPluralCategory(localeCode, Number(options?.count ?? 0));
    const str = selectPluralForm(value, category);
    return interpolate(str, vars);
  }

  if (typeof value === "string") {
    return interpolate(value, vars);
  }

  return path;
}
