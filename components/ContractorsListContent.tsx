"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { Breadcrumbs, BREADCRUMBS_WEBSITE_ID } from "@/components/Breadcrumbs";
import { UserLanguagesBadge } from "@/components/UserLanguagesBadge";
import { useT, useLocalePath } from "./LocaleContext";
import type { LocaleCode } from "@/lib/countries";

type ProRow = {
  id: number;
  name: string;
  slug: string | null;
  categorySlug: string;
  citySlugs: string[];
  rating: number | null;
  languages: string;
  verified: boolean;
  languagesArr?: string[];
};

type ContractorsListContentProps = {
  pros: ProRow[];
};

export function ContractorsListContent({ pros }: ContractorsListContentProps) {
  const t = useT();
  const path = useLocalePath();
  const breadcrumbItems = [
    { label: t("breadcrumbs.home"), href: path("") },
    { label: t("breadcrumbs.contractors"), href: path("contractors") },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center px-4 py-6 sm:py-8 md:py-16">
        <div className="w-full max-w-4xl mx-auto mb-3 sm:mb-4">
          <Breadcrumbs
            items={breadcrumbItems}
            pageSchema={{
              name: t("home.contractorsSectionTitle"),
              url: path("contractors"),
              isPartOf: { "@id": BREADCRUMBS_WEBSITE_ID },
              schemaType: "CollectionPage",
            }}
          />
        </div>
        <div className="w-full max-w-3xl mx-auto">
          <h1 className="text-xl sm:text-2xl font-semibold text-graphite mb-4 sm:mb-6">{t("home.contractorsSectionTitle")}</h1>
          <ul className="space-y-2">
            {pros.length === 0 ? (
              <li className="text-sm text-gray-500 py-8">{t("search.noPros")}</li>
            ) : (
              pros.map((pro) => (
                <li key={pro.id}>
                  <Link
                    href={pro.slug ? path(`contractor/${pro.slug}`) : path(`contractors/${pro.categorySlug}`)}
                    className="block p-3 rounded-lg border border-gray-200 bg-white hover:border-accent hover:bg-gray-50 text-sm min-h-[52px]"
                  >
                    <p className="font-medium text-graphite">
                      {pro.name}
                      {pro.verified && <span className="ml-1 text-accent">✓</span>}
                    </p>
                    {pro.citySlugs?.length > 0 && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        {pro.citySlugs.map((s) => t(`city.${s}` as "city.warsaw")).join(", ")}
                      </p>
                    )}
                    <div className="mt-1">
                      <UserLanguagesBadge languages={(pro.languagesArr ?? []) as LocaleCode[]} />
                    </div>
                    {pro.rating != null && <p className="text-xs text-gray-500 mt-0.5">{pro.rating}/100</p>}
                  </Link>
                </li>
              ))
            )}
          </ul>
        </div>
      </main>
    </div>
  );
}
