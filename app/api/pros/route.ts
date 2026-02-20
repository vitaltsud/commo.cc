import { NextRequest } from "next/server";
import { getDb } from "@/db";
import { users, proProfiles } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const country = searchParams.get("country") ?? "pl";
  const category = searchParams.get("category");

  const db = getDb();
  const cond = [eq(users.role, "pro"), eq(users.countryCode, country)];
  if (category) cond.push(eq(proProfiles.categorySlug, category));

  const rows = await db
    .select({
      id: proProfiles.id,
      userId: users.id,
      name: users.name,
      email: users.email,
      categorySlug: proProfiles.categorySlug,
      rating: proProfiles.rating,
      languages: proProfiles.languages,
      verified: proProfiles.verified,
      bio: proProfiles.bio,
    })
    .from(proProfiles)
    .innerJoin(users, eq(proProfiles.userId, users.id))
    .where(and(...cond))
    .limit(100);

  const out = rows.map((r) => ({
    ...r,
    languages: JSON.parse(r.languages || "[]") as string[],
    verified: Boolean(r.verified),
  }));

  return Response.json(out);
}
