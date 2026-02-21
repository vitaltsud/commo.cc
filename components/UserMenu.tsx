"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useT, useLocalePath } from "./LocaleContext";
import { useSession, type SessionUser } from "./useSession";

function UserAvatar({ user, className }: { user: SessionUser; className?: string }) {
  if (user.picture) {
    return (
      <img
        src={user.picture}
        alt=""
        width={32}
        height={32}
        className={`rounded-full object-cover ${className ?? "h-8 w-8"}`}
      />
    );
  }
  const initial = (user.name || user.email || "?").charAt(0).toUpperCase();
  return (
    <span
      className={`flex items-center justify-center rounded-full bg-accent/20 text-accent font-medium text-sm ${className ?? "h-8 w-8"}`}
      aria-hidden
    >
      {initial}
    </span>
  );
}

export function UserMenu() {
  const t = useT();
  const path = useLocalePath();
  const pathname = usePathname();
  const signinHref = pathname ? `${path("signin")}?callbackUrl=${encodeURIComponent(pathname)}` : path("signin");
  const { user, loading } = useSession();

  if (loading) {
    return (
      <span className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" aria-hidden />
    );
  }

  if (!user) {
    return (
      <Link
        href={signinHref}
        className="text-accent font-medium hover:underline text-sm"
      >
        {t("header.signIn")}
      </Link>
    );
  }

  return (
    <div className="relative group">
      <button
        type="button"
        className="flex items-center gap-2 rounded-lg border border-transparent py-1.5 pr-2 pl-1.5 hover:border-gray-200 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
        aria-expanded={false}
        aria-haspopup="true"
        aria-label={user.name}
      >
        <UserAvatar user={user} />
        <span className="max-w-[120px] truncate text-sm text-graphite hidden sm:inline">
          {user.name}
        </span>
        <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className="absolute right-0 top-full mt-1 w-56 rounded-lg border border-gray-200 bg-white py-1 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all z-50">
        <div className="px-3 py-2 border-b border-gray-100">
          <p className="font-medium text-graphite text-sm truncate">{user.name}</p>
          {user.email && (
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          )}
        </div>
        <Link
          href={path("my-projects")}
          className="block px-3 py-2 text-sm text-graphite hover:bg-gray-50"
        >
          {t("header.myProjects")}
        </Link>
        <Link
          href={path("pro")}
          className="block px-3 py-2 text-sm text-graphite hover:bg-gray-50"
        >
          {t("header.proDashboard")}
        </Link>
        <Link
          href={path("settings")}
          className="block px-3 py-2 text-sm text-graphite hover:bg-gray-50"
        >
          {t("header.settings")}
        </Link>
        <a
          href="/api/auth/signout"
          className="block px-3 py-2 text-sm text-graphite hover:bg-gray-50"
        >
          {t("header.signOut")}
        </a>
      </div>
    </div>
  );
}
