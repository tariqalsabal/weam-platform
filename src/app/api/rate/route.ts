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
    const { rating, comment, needHelp } = (await req.json()) as {
      rating: number;
      comment?: string;
      needHelp?: boolean;
    };
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "اختر تقييماً من 1 إلى 5" }, { status: 400 });
    }

    await prisma.rating.create({
      data: { customerId, rating: Number(rating), comment: comment || null, needHelp: !!needHelp },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}
