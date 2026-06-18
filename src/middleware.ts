import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/jwt";

const PUBLIC_PATHS = ["/login", "/register", "/policy", "/about-public"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySession(token) : null;

  const isPublic = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
  const isAdminArea = pathname.startsWith("/admin");

  // غير مسجّل ويحاول صفحة محمية
  if (!session && !isPublic) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // مسجّل ويحاول صفحة الدخول → وجّهه للوحته
  if (session && pathname === "/login") {
    const dest = session.role === "customer" ? "/home" : "/admin";
    return NextResponse.redirect(new URL(dest, req.url));
  }

  // منطقة الإدارة للموظفين/المدراء فقط
  if (isAdminArea && session && session.role === "customer") {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  return NextResponse.next();
}

export const config = {
  // استثنِ الملفات الثابتة و _next و api
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api|.*\\..*).*)"],
};
