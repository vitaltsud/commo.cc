import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Inter } from "next/font/google";
import { getBaseUrl } from "@/lib/hreflang";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "commo.cc — Global Services Marketplace",
  description: "Service marketplace connecting clients with verified professionals.",
  icons: { icon: "/favicon.svg" },
};

const WEBSITE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${getBaseUrl().replace(/\/$/, "")}/#website`,
  name: "commo.cc",
  url: getBaseUrl().replace(/\/$/, ""),
  description: "Global Services Marketplace — connect with verified professionals.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const lang = headersList.get("x-next-locale") ?? "en";
  return (
    <html lang={lang} className={inter.variable}>
      <body className="min-h-screen font-sans antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_JSON_LD) }} />
        {children}
      </body>
    </html>
  );
}
