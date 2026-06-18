import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function PUT(req: Request) {
  const session = await getSession();
  if (!session || session.role !== "customer") {
    return NextResponse.json({ error: "غير مصرّح" }, { status: 401 });
  }
  const customerId = Number(session.sub);

  try {
    const { name, email, phoneWhats, address } = (await req.json()) as {
      name?: string;
      email?: string;
      phoneWhats?: string;
      address?: string;
    };

    await prisma.customer.update({
      where: { id: customerId },
      data: {
        name: name?.trim() || undefined,
        email: email ?? undefined,
        phoneWhats: phoneWhats ?? undefined,
        address: address ?? undefined,
      },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}
