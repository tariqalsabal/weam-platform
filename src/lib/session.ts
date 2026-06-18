import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySession, type SessionPayload } from "./jwt";

// إعادة تصدير الأدوات الآمنة للـ Edge للراحة
export { SESSION_COOKIE, signSession, verifySession } from "./jwt";
export type { SessionPayload, SessionRole } from "./jwt";

/** اقرأ الجلسة الحالية من الكوكي (Server Components / Route Handlers فقط) */
export async function getSession(): Promise<SessionPayload | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySession(token);
}

export async function setSessionCookie(token: string) {
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSessionCookie() {
  (await cookies()).delete(SESSION_COOKIE);
}
