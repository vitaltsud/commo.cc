"use client";

import Link from "next/link";

const BASE_URL = typeof process !== "undefined" ? (process.env.NEXT_PUBLIC_APP_URL ?? "https://commo.cc").replace(/\/$/, "") : "https://commo.cc";
/** Use in pageSchema.isPartOf: { "@id": BREADCRUMBS_WEBSITE_ID } */
export const BREADCRUMBS_WEBSITE_ID = `${BASE_URL}/#website`;

export type BreadcrumbItem = { label: string; href: string };

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  /** Optional: WebPage/CollectionPage schema with isPartOf. */
  pageSchema?: {
    name: string;
    url: string;
    isPartOf: { "@id": string } | { "@type": string; name: string; url: string };
    schemaType?: "WebPage" | "CollectionPage";
  };
};

function absoluteUrl(href: string): string {
  const path = href.startsWith("/") ? href : `/${href}`;
  return `${BASE_URL}${path}`;
}

export function Breadcrumbs({ items, pageSchema }: BreadcrumbsProps) {
  if (items.length < 2) return null;

  const breadcrumbListSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      item: absoluteUrl(item.href),
    })),
  };

  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm text-gray-600 overflow-x-auto" itemScope itemType="https://schema.org/BreadcrumbList">
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-x-2" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              {i > 0 && <span aria-hidden="true">/</span>}
              {i < items.length - 1 ? (
                <Link href={item.href} itemProp="item" className="hover:text-accent transition-colors">
                  <span itemProp="name">{item.label}</span>
                </Link>
              ) : (
                <span itemProp="name" className="text-graphite font-medium" aria-current="page">
                  {item.label}
                </span>
              )}
              <meta itemProp="position" content={String(i + 1)} />
            </li>
          ))}
        </ol>
      </nav>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbListSchema) }}
      />
      {pageSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": pageSchema.schemaType ?? "WebPage",
              name: pageSchema.name,
              url: pageSchema.url.startsWith("http") ? pageSchema.url : absoluteUrl(pageSchema.url),
              isPartOf: pageSchema.isPartOf,
            }),
          }}
        />
      )}
    </>
  );
}
