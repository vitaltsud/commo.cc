import { NextRequest } from "next/server";
import { getDb } from "@/db";
import { projects, users } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const country = searchParams.get("country") ?? "pl";
  const category = searchParams.get("category");

  const db = getDb();
  const cond = [eq(projects.countryCode, country)];
  if (category) cond.push(eq(projects.categorySlug, category));

  const rows = await db
    .select({
      id: projects.id,
      title: projects.title,
      description: projects.description,
      status: projects.status,
      categorySlug: projects.categorySlug,
      createdAt: projects.createdAt,
      clientName: users.name,
      clientEmail: users.email,
    })
    .from(projects)
    .innerJoin(users, eq(projects.clientId, users.id))
    .where(and(...cond))
    .orderBy(desc(projects.createdAt))
    .limit(100);

  return Response.json(rows);
}
