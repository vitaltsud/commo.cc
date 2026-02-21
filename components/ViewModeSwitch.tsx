"use client";

import Link from "next/link";
import { useT, useLocalePath } from "./LocaleContext";
import { useViewMode } from "./ViewModeContext";

export function ViewModeSwitch() {
  const t = useT();
  const path = useLocalePath();
  const { viewMode, setViewMode } = useViewMode();

  const handleClient = () => setViewMode("client");
  const handleMaster = () => setViewMode("master");

  return (
    <div
      className="flex rounded-lg border-2 border-graphite/20 bg-gray-100 p-1 text-sm shadow-sm"
      role="tablist"
      aria-label={t("viewMode.switchLabel")}
    >
      <Link
        href={path("my-projects")}
        onClick={handleClient}
        role="tab"
        aria-selected={viewMode === "client"}
        className={`rounded-md px-3 py-1.5 font-semibold transition-colors ${
          viewMode === "client"
            ? "bg-accent text-white shadow-sm"
            : "text-graphite hover:bg-gray-200/80"
        }`}
      >
        {t("viewMode.asClient")}
      </Link>
      <Link
        href={path("pro")}
        onClick={handleMaster}
        role="tab"
        aria-selected={viewMode === "master"}
        className={`rounded-md px-3 py-1.5 font-semibold transition-colors ${
          viewMode === "master"
            ? "bg-accent text-white shadow-sm"
            : "text-graphite hover:bg-gray-200/80"
        }`}
      >
        {t("viewMode.asMaster")}
      </Link>
    </div>
  );
}
