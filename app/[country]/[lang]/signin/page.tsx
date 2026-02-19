import { SigninContent } from "@/components/SigninContent";

const hasGoogleAuth =
  !!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET;

export default function SignInPage() {
  return <SigninContent hasGoogleAuth={hasGoogleAuth} />;
}
