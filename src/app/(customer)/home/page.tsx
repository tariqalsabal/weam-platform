import ServiceMenu from "@/components/ServiceMenu";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

async function getStats(customerId: number) {
  try {
    const [assess, parts, agg] = await Promise.all([
      prisma.opPartnerAssessment.count({
        where: { opAssessment: { customerId } },
      }),
      prisma.partner.count({ where: { customerId } }),
      prisma.opPartnerAssessment.aggregate({
        where: { opAssessment: { customerId }, scorePct: { not: null } },
        _avg: { scorePct: true },
      }),
    ]);
    return { assess, parts, avg: Math.round(agg._avg.scorePct ?? 0) };
  } catch {
    return { assess: 0, parts: 0, avg: 0 };
  }
}

export default async function HomePage() {
  const session = await getSession();
  const stats = session ? await getStats(Number(session.sub)) : { assess: 0, parts: 0, avg: 0 };

  return (
    <div className="weam-wrap">
      <section className="weam-hero">
        <div className="weam-star">
          <svg width="52" height="52" viewBox="0 0 24 24" fill="#FFC23C" stroke="#FF9F1C" strokeWidth="1">
            <path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 18.9 5.9 21.4l1.4-6.8L2.2 9.9l6.9-.8z" />
          </svg>
        </div>
        <h1>نحو بيئة أسرية مستقرة ومتوازنة</h1>
        <p>
          تهدف منصة وئام للإصلاح الأسري إلى تحسين العلاقات الأسرية وتعزيز التواصل بين أفراد الأسرة من خلال تقييمات
          شاملة تغطي جميع الجوانب الأسرية.
        </p>
        <div className="weam-stats">
          <div className="weam-stat">
            <b>{stats.assess}</b>
            <span>تقييماتي</span>
          </div>
          <div className="weam-stat">
            <b>{stats.avg || "—"}</b>
            <span>متوسط النسبة %</span>
          </div>
          <div className="weam-stat">
            <b>{stats.parts}</b>
            <span>أطراف الأسرة</span>
          </div>
        </div>
      </section>

      <ServiceMenu />
    </div>
  );
}
