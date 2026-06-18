import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import NewAssessmentForm from "@/components/NewAssessmentForm";

export default async function NewAssessmentPage() {
  const session = await getSession();
  const customerId = Number(session?.sub);

  const [assessments, partners] = await Promise.all([
    prisma.assessment.findMany({ where: { active: true }, orderBy: { id: "asc" } }).catch(() => []),
    prisma.partner.findMany({ where: { customerId }, orderBy: { serial: "asc" } }).catch(() => []),
  ]);

  return (
    <div className="weam-wrap">
      <div className="weam-section-title">إجراء تقييم جديد</div>
      <NewAssessmentForm
        assessments={assessments.map((a) => ({ id: a.id, name: a.name }))}
        partners={partners.map((p) => ({ id: p.id, name: p.name }))}
      />
    </div>
  );
}
