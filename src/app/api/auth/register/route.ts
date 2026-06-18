import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { signSession, setSessionCookie } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const { name, phone, password } = (await req.json()) as {
      name: string;
      phone: string;
      password: string;
    };

    if (!name?.trim() || !phone?.trim() || !password) {
      return NextResponse.json({ error: "جميع الحقول مطلوبة" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "كلمة المرور 6 أحرف على الأقل" }, { status: 400 });
    }

    const exists = await prisma.customer.findUnique({ where: { phoneCall: phone.trim() } });
    if (exists) {
      return NextResponse.json({ error: "رقم الهاتف مسجّل مسبقاً" }, { status: 409 });
    }

    const customer = await prisma.customer.create({
      data: { name: name.trim(), phoneCall: phone.trim(), password: hashPassword(password) },
    });

    const token = await signSession({ sub: String(customer.id), role: "customer", name: customer.name });
    await setSessionCookie(token);
    return NextResponse.json({ ok: true, redirect: "/home" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}
