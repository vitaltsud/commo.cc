import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const SESSION_COOKIE = "commo_session";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function getSecret(): string {
  const secret = process.env.SESSION_SECRET || process.env.CRYPTO_SECRET;
  if (!secret || secret.length < 16) {
    return "dev-secret-min-16-chars"; // fallback for local dev only
  }
  return secret;
}

function sign(payload: string): string {
  const secret = getSecret();
  const hmac = createHmac("sha256", secret);
  hmac.update(payload);
  return payload + "." + hmac.digest("hex");
}

function verify(value: string): string | null {
  const dot = value.lastIndexOf(".");
  if (dot === -1) return null;
  const payload = value.slice(0, dot);
  const sig = value.slice(dot + 1);
  const expected = sign(payload);
  const expectedSig = expected.slice(expected.lastIndexOf(".") + 1);
  try {
    if (sig.length !== expectedSig.length || !timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expectedSig, "hex"))) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export interface SessionUser {
  /** Our DB users.id */
  userId: number;
  /** Google id (for display/backward compat) */
  id: string;
  name: string;
  email: string;
  picture: string | null;
}

export function encodeSession(user: SessionUser): string {
  const payload = JSON.stringify({
    userId: user.userId,
    id: user.id,
    name: user.name,
    email: user.email,
    picture: user.picture ?? null,
  });
  return sign(Buffer.from(payload).toString("base64url"));
}

export function decodeSession(value: string): SessionUser | null {
  const payload = verify(value);
  if (!payload) return null;
  try {
    const json = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (typeof json.userId !== "number" || typeof json.name !== "string" || typeof json.email !== "string") return null;
    return {
      userId: json.userId,
      id: String(json.id ?? ""),
      name: json.name,
      email: json.email,
      picture: typeof json.picture === "string" ? json.picture : null,
    };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  return decodeSession(raw);
}

export function sessionCookieOptions() {
  return {
    name: SESSION_COOKIE,
    path: "/",
    maxAge: MAX_AGE,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
  };
}
