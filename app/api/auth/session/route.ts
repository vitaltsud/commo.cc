import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { proProfiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/session";

export async function GET() {
  const sessionUser = await getSession();
  if (!sessionUser) {
    return NextResponse.json({ user: null, roles: null }, { status: 200 });
  }
  const db = getDb();
  const profiles = await db.query.proProfiles.findMany({
    where: eq(proProfiles.userId, sessionUser.userId),
    columns: { verified: true },
  });
  const hasPro = profiles.length > 0;
  const proVerified = profiles.some((p) => p.verified);
  return NextResponse.json(
    {
      user: {
        userId: sessionUser.userId,
        id: sessionUser.id,
        name: sessionUser.name,
        email: sessionUser.email,
        picture: sessionUser.picture,
      },
      roles: {
        client: true,
        pro: hasPro,
        proVerified,
      },
    },
    { status: 200 }
  );
}
