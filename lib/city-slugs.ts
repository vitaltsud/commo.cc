/**
 * City slugs per country for SEO URLs: /country/city/ and /country/city/lang/
 * Must stay in sync with DB seed cities.
 */

export const CITY_SLUGS_BY_COUNTRY: Record<string, string[]> = {
  pl: ["warsaw", "krakow", "gdansk", "wroclaw", "poznan"],
  ua: ["kyiv", "lviv", "odesa", "kharkiv"],
  de: ["berlin", "munich", "hamburg", "cologne"],
  gb: ["london", "birmingham", "manchester"],
  us: ["newyork", "losangeles", "chicago", "houston"],
  ca: ["toronto", "montreal", "vancouver", "calgary"],
  al: ["tirana", "durres", "vlore"],
  me: ["podgorica", "niksic", "budva"],
  bg: ["sofia", "plovdiv", "varna", "burgas"],
  it: ["rome", "milan", "naples", "turin", "florence"],
};

export function isCitySlug(countryCode: string, segment: string): boolean {
  const slugs = CITY_SLUGS_BY_COUNTRY[countryCode];
  return slugs ? slugs.includes(segment.toLowerCase()) : false;
}
