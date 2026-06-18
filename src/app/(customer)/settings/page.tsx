import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import SettingsClient from "@/components/SettingsClient";

export default async function SettingsPage() {
  const session = await getSession();
  const customerId = Number(session?.sub);

  const customer = await prisma.customer
    .findUnique({
      where: { id: customerId },
      include: { partners: { orderBy: { serial: "asc" } } },
    })
    .catch(() => null);

  if (!customer) {
    return (
      <div className="weam-wrap">
        <div className="weam-glass p-6 text-center" style={{ color: "var(--txt-dim)" }}>
          تعذّر تحميل البيانات (تأكّد من اتصال القاعدة).
        </div>
      </div>
    );
  }

  return (
    <SettingsClient
      profile={{
        name: customer.name,
        phoneCall: customer.phoneCall,
        email: customer.email,
        phoneWhats: customer.phoneWhats,
        address: customer.address,
      }}
      partners={customer.partners.map((p) => ({ id: p.id, name: p.name, gender: p.gender }))}
    />
  );
}
