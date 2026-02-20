"use client";

import Link from "next/link";
import { useT, useLocalePath } from "./LocaleContext";
import { UserLanguagesBadge } from "./UserLanguagesBadge";
import type { LocaleCode } from "@/lib/countries";

type ProRow = {
  id: number;
  name: string;
  categorySlug: string;
  citySlug?: string | null;
  rating: number | null;
  languages: string[];
  verified: boolean;
};

type Props = { pros: ProRow[] };

export function FeedMasters({ pros }: Props) {
  const t = useT();
  const path = useLocalePath();

  if (pros.length === 0) return null;

  return (
    <section className="w-full max-w-4xl mx-auto mb-12">
      <h2 className="text-lg font-medium text-graphite mb-4">{t("home.mastersFeed")}</h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {pros.slice(0, 6).map((pro) => (
          <li key={pro.id}>
            <Link
              href={path(`search/${pro.categorySlug}`)}
              className="block p-4 rounded-lg border border-gray-200 hover:border-accent hover:bg-gray-50"
            >
              <p className="font-medium text-graphite text-sm">
                {pro.name}
                {pro.verified && <span className="ml-1 text-accent">✓</span>}
              </p>
              <div className="mt-1">
                <UserLanguagesBadge languages={pro.languages as LocaleCode[]} />
              </div>
              {pro.rating != null && (
                <p className="text-xs text-gray-500 mt-1">{pro.rating}/100</p>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
