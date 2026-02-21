import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { MyProjectsContent } from "@/components/MyProjectsContent";

type Props = { params: Promise<{ country: string; lang: string }> };

export default async function MyProjectsPage({ params }: Props) {
  const { country, lang } = await params;
  const session = await getSession();
  if (!session) {
    redirect(`/${country}/${lang}/signin?callbackUrl=${encodeURIComponent(`/${country}/${lang}/my-projects`)}`);
  }
  return <MyProjectsContent />;
}
