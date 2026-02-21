import type { LocaleCode } from "./countries";

/** CLDR plural categories: zero, one, two, few, many, other. "other" is required in every locale. */
export type PluralCategory = "zero" | "one" | "two" | "few" | "many" | "other";

const localeToBCP47: Record<LocaleCode, string> = {
  en: "en",
  pl: "pl",
  ru: "ru",
  uk: "uk",
  de: "de",
  fr: "fr",
  es: "es",
  it: "it",
  sq: "sq",
  bg: "bg",
  sr: "sr",
};

/**
 * Returns the CLDR plural category for the given locale and count.
 * Uses Intl.PluralRules so all language rules (e.g. Russian 1/2-4/5-20/21...) are correct.
 */
export function getPluralCategory(localeCode: LocaleCode, count: number): PluralCategory {
  const tag = localeToBCP47[localeCode] ?? "en";
  const rule = new Intl.PluralRules(tag, { type: "cardinal" });
  const category = rule.select(count) as PluralCategory;
  return category;
}

/** Keys that are valid plural form keys in message objects */
export const PLURAL_FORM_KEYS: readonly PluralCategory[] = ["zero", "one", "two", "few", "many", "other"];

export function isPluralFormKey(key: string): key is PluralCategory {
  return (PLURAL_FORM_KEYS as readonly string[]).includes(key);
}

/** Pick the best form: use category if present, else fall back to "other". */
export function selectPluralForm(forms: Record<string, string>, category: PluralCategory): string {
  if (forms[category] != null && forms[category] !== "") return forms[category];
  return forms.other ?? "";
}
