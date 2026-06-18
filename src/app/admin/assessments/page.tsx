import { prisma } from "@/lib/prisma";

async function getAssessments() {
  try {
    return await prisma.assessment.findMany({
      include: { _count: { select: { subs: true, opAssess: true } } },
      orderBy: { id: "asc" },
    });
  } catch {
    return [];
  }
}

export default async function AdminAssessments() {
  const items = await getAssessments();
  return (
    <>
      <div className="weam-section-title">أدوات التقييم</div>
      <div className="grid gap-4 sm:grid-cols-2">
        {items.length === 0 ? (
          <div className="weam-glass p-6 text-center" style={{ color: "var(--txt-mut)" }}>
            لا توجد أدوات بعد.
          </div>
        ) : (
          items.map((a) => (
            <div key={a.id} className="weam-glass p-5">
              <h3 className="mb-2 font-extrabold leading-7">{a.name}</h3>
              <div className="flex gap-2">
                <span className="weam-badge">{a._count.subs} جوانب</span>
                <span className="weam-badge">{a._count.opAssess} تقييم منفّذ</span>
                <span className="weam-badge">{a.forGender || "للجميع"}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
