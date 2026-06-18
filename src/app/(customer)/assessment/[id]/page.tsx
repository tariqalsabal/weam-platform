import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import AssessmentDetail from "@/components/AssessmentDetail";

export default async function AssessmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();
  if (!session) redirect("/login");

  const op = await prisma.opPartnerAssessment
    .findUnique({
      where: { id: Number(id) },
      include: {
        opAssessment: { include: { assessment: true, customer: { select: { id: true, name: true } } } },
        partner: true,
        details: {
          orderBy: { id: "asc" },
          include: { indicator: { include: { sub: true } } },
        },
      },
    })
    .catch(() => null);

  if (!op) notFound();
  if (session.role === "customer" && op.opAssessment.customer.id !== Number(session.sub)) {
    redirect("/assessments");
  }

  // تجميع المؤشرات حسب الجانب
  const groupsMap = new Map<
    number,
    { subName: string; rows: { opDetId: number; name: string; degree: number | null; priority: string; note: string | null }[] }
  >();
  for (const d of op.details) {
    const sub = d.indicator.sub;
    if (!groupsMap.has(sub.id)) groupsMap.set(sub.id, { subName: sub.name, rows: [] });
    groupsMap.get(sub.id)!.rows.push({
      opDetId: d.id,
      name: d.indicator.indicator,
      degree: d.degree,
      priority: d.priority,
      note: d.note,
    });
  }

  return (
    <AssessmentDetail
      header={{
        assessmentName: op.opAssessment.assessment.name,
        partnerName: op.partnerName || op.partner?.name || "—",
        date: op.date.toISOString(),
        scorePct: op.scorePct,
        progressPct: op.progressPct,
      }}
      groups={Array.from(groupsMap.values())}
    />
  );
}
