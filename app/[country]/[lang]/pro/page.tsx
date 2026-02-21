import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getDb } from "@/db";
import { proProfiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ProDashboardContent } from "@/components/ProDashboardContent";

type Props = { params: Promise<{ country: string; lang: string }> };

export default async function ProPage({ params }: Props) {
  const session = await getSession();
  if (!session) {
    const p = await params;
    redirect(`/${p.country}/${p.lang}/signin?callbackUrl=${encodeURIComponent(`/${p.country}/${p.lang}/pro`)}`);
  }
  const db = getDb();
  const profiles = await db.query.proProfiles.findMany({
    where: eq(proProfiles.userId, session.userId),
    columns: { id: true, verified: true, categorySlug: true },
  });
  const hasPro = profiles.length > 0;
  const proVerified = profiles.some((p) => p.verified);

  return (
    <ProDashboardContent
      hasProProfile={hasPro}
      isVerified={proVerified}
      profiles={profiles}
    />
  );
}
