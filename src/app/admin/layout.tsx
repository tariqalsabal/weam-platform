import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

const nav = [
  { href: "/admin", label: "لوحة المعلومات", icon: "📊" },
  { href: "/admin/customers", label: "العملاء", icon: "👥" },
  { href: "/admin/assessments", label: "أدوات التقييم", icon: "📋" },
  { href: "/admin/offices", label: "المكاتب", icon: "🏢" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role === "customer") redirect("/home");

  return (
    <div className="relative z-[1] flex min-h-screen">
      {/* الشريط الجانبي */}
      <aside className="weam-glass m-3 hidden w-64 shrink-0 flex-col p-4 md:flex" style={{ borderRadius: "var(--r-lg)" }}>
        <div className="weam-brand mb-6 px-2">
          <span className="weam-logo">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 21s-7-4.4-9.3-8.4C1 9.4 2.6 6 6 6c2 0 3.2 1.2 4 2.4C10.8 7.2 12 6 14 6c3.4 0 5 3.4 3.3 6.6C19 16.6 12 21 12 21z"
                fill="#15C3B2"
              />
            </svg>
          </span>
          <span className="text-base">وئام — الإدارة</span>
        </div>

        <nav className="flex flex-col gap-1.5">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 font-bold transition hover:bg-white/10"
            >
              <span>{n.icon}</span>
              <span>{n.label}</span>
            </Link>
          ))}
        </nav>

        <form action="/api/auth/logout" method="post" className="mt-auto">
          <button type="submit" className="weam-btn danger block" style={{ padding: "10px 16px", fontSize: 14 }}>
            تسجيل الخروج
          </button>
        </form>
      </aside>

      {/* المحتوى */}
      <main className="flex-1 overflow-x-hidden">
        <header className="weam-topbar md:rounded-none">
          <div className="font-black">مرحباً، {session.name}</div>
          <span className="weam-badge">{session.role === "admin" ? "مدير" : "موظف"}</span>
        </header>
        <div className="weam-wrap-wide">{children}</div>
      </main>
    </div>
  );
}
