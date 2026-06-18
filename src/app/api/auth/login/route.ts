import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import { signSession, setSessionCookie } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const { identifier, password, mode } = (await req.json()) as {
      identifier: string;
      password: string;
      mode?: "customer" | "staff";
    };

    if (!identifier || !password) {
      return NextResponse.json({ error: "البيانات ناقصة" }, { status: 400 });
    }

    if (mode === "staff") {
      const user = await prisma.user.findUnique({ where: { username: identifier } });
      if (!user || !verifyPassword(password, user.password)) {
        return NextResponse.json({ error: "بيانات الدخول غير صحيحة" }, { status: 401 });
      }
      const token = await signSession({
        sub: String(user.id),
        role: user.role === "ADMIN" ? "admin" : "staff",
        name: user.fullName,
      });
      await setSessionCookie(token);
      return NextResponse.json({ ok: true, redirect: "/admin" });
    }

    // عميل: الدخول بالهاتف
    const customer = await prisma.customer.findUnique({ where: { phoneCall: identifier } });
    if (!customer || !verifyPassword(password, customer.password)) {
      return NextResponse.json({ error: "رقم الهاتف أو كلمة المرور غير صحيحة" }, { status: 401 });
    }
    const token = await signSession({
      sub: String(customer.id),
      role: "customer",
      name: customer.name,
    });
    await setSessionCookie(token);
    return NextResponse.json({ ok: true, redirect: "/home" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}
