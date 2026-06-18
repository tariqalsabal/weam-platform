import { NextResponse } from "next/server";
import { Priority } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { computeTotals } from "@/lib/scoring";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "غير مصرّح" }, { status: 401 });

  try {
    const { opDetId, degree, priority, note } = (await req.json()) as {
      opDetId: number;
      degree: number | null;
      priority: Priority;
      note?: string;
    };

    const det = await prisma.opDetAssessment.findUnique({
      where: { id: Number(opDetId) },
      include: { opPartner: { include: { opAssessment: { select: { customerId: true } } } } },
    });
    if (!det) return NextResponse.json({ error: "غير موجود" }, { status: 404 });

    if (session.role === "customer" && det.opPartner.opAssessment.customerId !== Number(session.sub)) {
      return NextResponse.json({ error: "ممنوع" }, { status: 403 });
    }

    await prisma.opDetAssessment.update({
      where: { id: det.id },
      data: {
        degree: degree == null ? null : Number(degree),
        priority: priority ?? "NORMAL",
        note: note ?? null,
      },
    });

    const rows = await prisma.opDetAssessment.findMany({
      where: { opPartnerAssessmentId: det.opPartnerAssessmentId },
      select: { degree: true, priority: true },
    });
    const totals = computeTotals(rows);
    await prisma.opPartnerAssessment.update({
      where: { id: det.opPartnerAssessmentId },
      data: totals,
    });

    return NextResponse.json({ ok: true, ...totals });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}
