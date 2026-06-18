import { prisma } from "@/lib/prisma";

async function getOffices() {
  try {
    return await prisma.office.findMany({
      include: { _count: { select: { users: true, customers: true } } },
      orderBy: { id: "asc" },
    });
  } catch {
    return [];
  }
}

export default async function AdminOffices() {
  const offices = await getOffices();
  return (
    <>
      <div className="weam-section-title">المكاتب</div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {offices.length === 0 ? (
          <div className="weam-glass p-6 text-center" style={{ color: "var(--txt-mut)" }}>
            لا توجد مكاتب بعد.
          </div>
        ) : (
          offices.map((o) => (
            <div key={o.id} className="weam-glass p-5">
              <h3 className="mb-1 font-extrabold">{o.name}</h3>
              <p className="mb-3 text-sm" style={{ color: "var(--txt-dim)" }} dir="ltr">
                {o.phone || "—"}
              </p>
              <div className="flex gap-2">
                <span className="weam-badge">{o._count.users} موظف</span>
                <span className="weam-badge">{o._count.customers} عميل</span>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
