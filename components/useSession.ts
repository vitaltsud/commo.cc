"use client";

import { useState, useEffect } from "react";

export interface SessionUser {
  userId: number;
  id: string;
  name: string;
  email: string;
  picture: string | null;
}

export interface SessionRoles {
  client: boolean;
  pro: boolean;
  proVerified: boolean;
}

export function useSession(): {
  user: SessionUser | null;
  roles: SessionRoles | null;
  loading: boolean;
} {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [roles, setRoles] = useState<SessionRoles | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/session", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : { user: null, roles: null }))
      .then((data) => {
        if (!cancelled) {
          if (data?.user) setUser(data.user);
          else setUser(null);
          if (data?.roles) setRoles(data.roles);
          else setRoles(null);
        }
      })
      .catch(() => {
        if (!cancelled) setUser(null);
        if (!cancelled) setRoles(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { user, roles, loading };
}
