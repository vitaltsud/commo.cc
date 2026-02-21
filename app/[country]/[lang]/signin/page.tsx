import { SigninContent } from "@/components/SigninContent";

const hasGoogleAuth =
  !!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET;

type Props = { searchParams: Promise<{ callbackUrl?: string }> };

export default async function SignInPage({ searchParams }: Props) {
  const params = await searchParams;
  const callbackUrl = params.callbackUrl ?? "";
  return <SigninContent hasGoogleAuth={hasGoogleAuth} callbackUrl={callbackUrl} />;
}
