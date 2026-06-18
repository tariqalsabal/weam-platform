import { pbkdf2Sync, randomBytes, timingSafeEqual } from "crypto";

// تجزئة كلمة المرور بـ PBKDF2-HMAC-SHA256
// الصيغة المخزّنة:  pbkdf2$<iterations>$<saltBase64>$<hashBase64>
const ITERATIONS = 100000;
const KEYLEN = 32;
const DIGEST = "sha256";

export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const hash = pbkdf2Sync(password, salt, ITERATIONS, KEYLEN, DIGEST);
  return `pbkdf2$${ITERATIONS}$${salt.toString("base64")}$${hash.toString("base64")}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  try {
    const [scheme, iterStr, saltB64, hashB64] = stored.split("$");
    if (scheme !== "pbkdf2") return false;
    const iterations = parseInt(iterStr, 10);
    const salt = Buffer.from(saltB64, "base64");
    const expected = Buffer.from(hashB64, "base64");
    const actual = pbkdf2Sync(password, salt, iterations, expected.length, DIGEST);
    return actual.length === expected.length && timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}
