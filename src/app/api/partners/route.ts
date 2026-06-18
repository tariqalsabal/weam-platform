import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session || session.role !== "customer") {
    return NextResponse.json({ error: "غير مصرّح" }, { status: 401 });
  }
  const customerId = Number(session.sub);

  try {
    const { name, gender, age } = (await req.json()) as { name: string; gender?: string; age?: number };
    if (!name?.trim()) return NextResponse.json({ error: "الاسم مطلوب" }, { status: 400 });

    const count = await prisma.partner.count({ where: { customerId } });
    const partner = await prisma.partner.create({
      data: {
        customerId,
        name: name.trim(),
        gender: gender || null,
        age: age ? Number(age) : null,
        serial: count + 1,
      },
    });
    return NextResponse.json({ ok: true, partner });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getSession();
  if (!session || session.role !== "customer") {
    return NextResponse.json({ error: "غير مصرّح" }, { status: 401 });
  }
  const customerId = Number(session.sub);
  const id = Number(new URL(req.url).searchParams.get("id"));
  if (!id) return NextResponse.json({ error: "المعرّف مطلوب" }, { status: 400 });

  try {
    const partner = await prisma.partner.findFirst({ where: { id, customerId } });
    if (!partner) return NextResponse.json({ error: "غير موجود" }, { status: 404 });
    await prisma.partner.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "لا يمكن الحذف (مرتبط بتقييمات)" }, { status: 400 });
  }
}
