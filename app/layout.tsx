import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getLocaleContext } from "@/components/LocaleProvider";
import { LocaleProvider } from "@/components/LocaleContext";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "commo.cc — Global Trust Marketplace",
  description: "Service marketplace connecting clients with verified professionals.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const localeState = await getLocaleContext();
  return (
    <html lang={localeState.localeCode} className={inter.variable}>
      <body className="min-h-screen font-sans antialiased">
        <LocaleProvider value={localeState}>
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
