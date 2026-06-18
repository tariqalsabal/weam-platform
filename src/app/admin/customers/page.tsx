import { prisma } from "@/lib/prisma";

async function getCustomers() {
  try {
    return await prisma.customer.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { partners: true, assessments: true } }, office: true },
      take: 100,
    });
  } catch {
    return [];
  }
}

export default async function AdminCustomers() {
  const customers = await getCustomers();

  return (
    <>
      <div className="weam-section-title">العملاء</div>

      <div className="weam-glass overflow-hidden p-2">
        <table className="w-full text-right text-sm">
          <thead>
            <tr style={{ color: "var(--txt-dim)" }}>
              <th className="p-3 font-extrabold">#</th>
              <th className="p-3 font-extrabold">الاسم</th>
              <th className="p-3 font-extrabold">الهاتف</th>
              <th className="p-3 font-extrabold">المكتب</th>
              <th className="p-3 font-extrabold">الأطراف</th>
              <th className="p-3 font-extrabold">التقييمات</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center" style={{ color: "var(--txt-mut)" }}>
                  لا يوجد عملاء بعد — شغّل البذور (npm run db:seed) أو أضِف عميلاً.
                </td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr key={c.id} className="border-t transition hover:bg-white/5" style={{ borderColor: "var(--line)" }}>
                  <td className="p-3">{c.id}</td>
                  <td className="p-3 font-bold">{c.name}</td>
                  <td className="p-3" dir="ltr">{c.phoneCall}</td>
                  <td className="p-3">{c.office?.name || "—"}</td>
                  <td className="p-3">{c._count.partners}</td>
                  <td className="p-3">{c._count.assessments}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
