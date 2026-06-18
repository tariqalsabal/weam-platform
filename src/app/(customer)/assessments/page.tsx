import Link from "next/link";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

async function getMyAssessments(customerId: number) {
  try {
    const rows = await prisma.opPartnerAssessment.findMany({
      where: { opAssessment: { customerId } },
      orderBy: { date: "desc" },
      include: { opAssessment: { include: { assessment: true } }, partner: true },
    });
    return rows.map((r) => ({
      id: r.id,
      title: r.opAssessment.assessment.name,
      partner: r.partnerName || r.partner?.name || "—",
      date: r.date,
      note: r.note,
      progress: r.progressPct,
      score: r.scorePct,
    }));
  } catch {
    return [];
  }
}

function barClass(p: number) {
  if (p < 40) return "var(--grad-danger)";
  if (p < 75) return "var(--grad-warm)";
  return "var(--grad-green)";
}

export default async function AssessmentsPage() {
  const session = await getSession();
  const items = session ? await getMyAssessments(Number(session.sub)) : [];

  return (
    <div className="weam-wrap-wide">
      <div className="weam-section-title">تقييماتي</div>

      {items.length === 0 ? (
        <div className="weam-glass p-8 text-center" style={{ color: "var(--txt-dim)" }}>
          لا توجد تقييمات بعد.{" "}
          <Link href="/assessment/new" className="font-extrabold" style={{ color: "var(--teal)" }}>
            ابدأ تقييماً جديداً
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <div key={it.id} className="weam-glass p-5">
              <div className="mb-3 flex items-center justify-between">
                <span className="weam-badge">تقييم #{it.id}</span>
                <span className="text-xs" style={{ color: "var(--txt-mut)" }}>
                  {new Date(it.date).toLocaleDateString("ar-SA")}
                </span>
              </div>
              <h3 className="mb-1 text-base font-extrabold leading-7">{it.title}</h3>
              <p className="mb-4 text-sm" style={{ color: "var(--txt-dim)" }}>
                طرف التقييم: {it.partner}
              </p>

              <div className="mb-1 flex items-center justify-between text-xs" style={{ color: "var(--txt-dim)" }}>
                <span>نسبة التقدّم</span>
                <span className="font-black">{it.progress}%</span>
              </div>
              <div className="weam-progress mb-4">
                <i style={{ width: `${it.progress}%`, background: barClass(it.progress) }} />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: "var(--txt-dim)" }}>
                  النتيجة: <b style={{ color: "var(--green)" }}>{it.score != null ? it.score + "%" : "—"}</b>
                </span>
                <Link href={`/assessment/${it.id}`} className="weam-btn violet" style={{ padding: "9px 16px", fontSize: 14 }}>
                  بدء / عرض
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
