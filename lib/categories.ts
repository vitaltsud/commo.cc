export const categories = [
  { id: "cleaning", label: "Cleaning", slug: "cleaning" },
  { id: "plumbing", label: "Plumbing", slug: "plumbing" },
  { id: "electrical", label: "Electrical", slug: "electrical" },
  { id: "construction", label: "Construction", slug: "construction" },
  { id: "painting", label: "Painting", slug: "painting" },
  { id: "moving", label: "Moving", slug: "moving" },
  { id: "landscaping", label: "Landscaping", slug: "landscaping" },
  { id: "appliances", label: "Appliances", slug: "appliances" },
] as const;

export const categorySlugs = categories.map((c) => c.slug);
export function isValidCategorySlug(slug: string): slug is (typeof categories)[number]["slug"] {
  return categorySlugs.includes(slug as (typeof categories)[number]["slug"]);
}
