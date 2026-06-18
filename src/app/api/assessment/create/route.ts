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
    const { assessmentId, partnerId } = (await req.json()) as {
      assessmentId: number;
      partnerId: number;
    };

    const partner = await prisma.partner.findFirst({
      where: { id: Number(partnerId), customerId },
    });
    if (!partner) {
      return NextResponse.json({ error: "الطرف غير صحيح" }, { status: 400 });
    }

    const assessment = await prisma.assessment.findUnique({
      where: { id: Number(assessmentId) },
      include: { subs: { include: { indicators: { select: { id: true } } } } },
    });
    if (!assessment) {
      return NextResponse.json({ error: "الأداة غير موجودة" }, { status: 400 });
    }

    const indicatorIds = assessment.subs.flatMap((s) => s.indicators.map((i) => i.id));
    if (indicatorIds.length === 0) {
      return NextResponse.json({ error: "هذه الأداة لا تحتوي مؤشرات" }, { status: 400 });
    }

    const customer = await prisma.customer.findUnique({ where: { id: customerId } });

    const op = await prisma.opAssessment.create({
      data: {
        customerId,
        assessmentId: assessment.id,
        officeId: customer?.officeId ?? null,
        partners: {
          create: {
            partnerId: partner.id,
            partnerName: partner.name,
            details: { create: indicatorIds.map((id) => ({ indicatorId: id })) },
          },
        },
      },
      include: { partners: { select: { id: true } } },
    });

    return NextResponse.json({ id: op.partners[0].id });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}
