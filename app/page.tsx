import { LandingContent } from "@/components/LandingContent";
import { getBaseUrl } from "@/lib/hreflang";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: `${getBaseUrl().replace(/\/$/, "")}/`,
  },
};

export default function RootPage() {
  return <LandingContent />;
}
