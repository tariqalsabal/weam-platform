import { prisma } from "@/lib/prisma";

async function getCounts() {
  try {
    const [customers, partners, assessments, opAssess] = await Promise.all([
      prisma.customer.count(),
      prisma.partner.count(),
      prisma.assessment.count(),
      prisma.opPartnerAssessment.count(),
    ]);
    return { customers, partners, assessments, opAssess };
  } catch {
    return { customers: 0, partners: 0, assessments: 0, opAssess: 0 };
  }
}

const cards = [
  { key: "customers", label: "العملاء", grad: "var(--grad-primary)", icon: "👥" },
  { key: "opAssess", label: "التقييمات المنفّذة", grad: "var(--grad-violet)", icon: "📝" },
  { key: "assessments", label: "أدوات التقييم", grad: "var(--grad-warm)", icon: "📋" },
  { key: "partners", label: "أطراف الأسر", grad: "var(--grad-green)", icon: "🤝" },
] as const;

export default async function AdminDashboard() {
  const counts = await getCounts();

  return (
    <>
      <div className="weam-section-title">لوحة المعلومات</div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.key} className="relative overflow-hidden rounded-2xl p-5 text-white" style={{ background: c.grad, boxShadow: "var(--sh)" }}>
            <div className="text-3xl">{c.icon}</div>
            <div className="mt-3 text-4xl font-black">{counts[c.key]}</div>
            <div className="text-sm opacity-90">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="weam-glass mt-6 p-6">
        <h3 className="mb-2 text-lg font-black">نظرة عامة</h3>
        <p className="text-sm leading-8" style={{ color: "var(--txt-dim)" }}>
          من هنا تدير العملاء وأدوات التقييم والمكاتب وتتابع التقييمات المنفّذة. الأقسام التفصيلية (التقارير،
          التحليل بالذكاء الاصطناعي، الصلاحيات) سنبنيها في الخطوات التالية.
        </p>
      </div>
    </>
  );
}
