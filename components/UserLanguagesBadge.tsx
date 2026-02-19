"use client";

import { useT } from "./LocaleContext";
import { localeNamesNative } from "@/lib/locales";
import type { LocaleCode } from "@/lib/countries";

interface UserLanguagesBadgeProps {
  /** Languages the user (client or pro) speaks — shown when viewing their profile/card */
  languages: LocaleCode[];
  className?: string;
}

export function UserLanguagesBadge({ languages, className = "" }: UserLanguagesBadgeProps) {
  const t = useT();
  if (!languages.length) return null;
  const labels = languages.map((loc) => localeNamesNative[loc] ?? loc).join(", ");
  return (
    <div className={`text-sm text-gray-600 ${className}`}>
      <span className="font-medium text-graphite">{t("profile.speaks")}:</span> {labels}
    </div>
  );
}
