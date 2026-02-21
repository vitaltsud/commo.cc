"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";

export type ViewMode = "client" | "master";

const STORAGE_KEY = "commo_view_mode";

function getStored(): ViewMode {
  if (typeof window === "undefined") return "client";
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "client" || v === "master") return v;
  } catch {}
  return "client";
}

const ViewModeContext = createContext<{
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}>({ viewMode: "client", setViewMode: () => {} });

export function ViewModeProvider({ children }: { children: React.ReactNode }) {
  const [viewMode, setState] = useState<ViewMode>("client");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setState(getStored());
    setMounted(true);
  }, []);

  const setViewMode = useCallback((mode: ViewMode) => {
    setState(mode);
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {}
  }, []);

  const value = mounted ? { viewMode, setViewMode } : { viewMode: "client" as ViewMode, setViewMode };

  return <ViewModeContext.Provider value={value}>{children}</ViewModeContext.Provider>;
}

export function useViewMode() {
  return useContext(ViewModeContext);
}
