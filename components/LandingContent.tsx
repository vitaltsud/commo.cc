"use client";

import Link from "next/link";
import { LandingMap } from "./LandingMap";

const BLOCKS = [
  {
    title: "Hard Trust",
    desc: "Mandatory ID verification and immutable client ratings. Only verified professionals; only clients can rate.",
  },
  {
    title: "No commission on deals",
    desc: "Tiered subscription for pros by category and region. Loyalty discount for 4.9+ rating.",
  },
  {
    title: "Google ecosystem",
    desc: "Sign in with Google. Communication in Google Chat. AI-driven insights for admins.",
  },
];

export function LandingContent() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/" className="text-xl font-semibold text-graphite">
            commo.cc
          </Link>
        </div>
      </header>
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-semibold text-graphite text-center mb-4">
          Global Trust Marketplace
        </h1>
        <p className="text-center text-gray-600 mb-12 max-w-xl mx-auto">
          Service marketplace connecting clients with verified professionals. Choose your country below.
        </p>

        <section className="grid gap-6 md:grid-cols-3 mb-16">
          {BLOCKS.map((b) => (
            <div
              key={b.title}
              className="p-5 rounded-xl border border-gray-200 text-graphite"
            >
              <h2 className="font-semibold text-lg mb-2">{b.title}</h2>
              <p className="text-sm text-gray-600">{b.desc}</p>
            </div>
          ))}
        </section>

        <LandingMap />
      </main>
    </div>
  );
}
