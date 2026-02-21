"use client";

import Link from "next/link";
import { useT, useLocalePath } from "./LocaleContext";

export function Footer() {
  const t = useT();
  const path = useLocalePath();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-gray-50 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
        <span>© {year} commo.cc</span>
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1">
          <Link href={path("privacy-policy")} className="hover:text-accent transition-colors">
            {t("footer.privacyPolicy")}
          </Link>
          <Link href={path("terms")} className="hover:text-accent transition-colors">
            {t("footer.terms")}
          </Link>
          <Link href="/" className="hover:text-accent transition-colors">
            {t("footer.global")}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
