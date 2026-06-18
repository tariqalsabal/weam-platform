import { SignJWT, jwtVerify } from "jose";

// آمن للـ Edge (middleware) — لا يستورد next/headers
export const SESSION_COOKIE = "weam_session";

export type SessionRole = "admin" | "staff" | "customer";

export type SessionPayload = {
  sub: string;
  role: SessionRole;
  name: string;
};

function getSecret() {
  const s = process.env.AUTH_SECRET || "dev-secret-change-me-in-production";
  return new TextEncoder().encode(s);
}

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}
