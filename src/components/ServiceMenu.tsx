"use client";

import { useRouter } from "next/navigation";

type Service = {
  href: string;
  cls: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
};

const services: Service[] = [
  {
    href: "/assessment/new",
    cls: "c-new",
    title: "إجراء تقييم جديد",
    subtitle: "ابدأ تقييم طرف من أسرتك الآن",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M12 5v14M5 12h14" />
      </svg>
    ),
  },
  {
    href: "/assessments",
    cls: "c-my",
    title: "تقييماتي",
    subtitle: "استعرض نتائج تقييماتك السابقة",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M8 6h11M8 12h11M8 18h11M3.5 6h.01M3.5 12h.01M3.5 18h.01" />
      </svg>
    ),
  },
  {
    href: "/settings",
    cls: "c-set",
    title: "الإعدادات",
    subtitle: "بياناتك وأطراف أسرتك والحساب",
    icon: (
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8 2 2 0 1 1-2.8 2.8 1.6 1.6 0 0 0-2.7 1.1 2 2 0 1 1-4 0 1.6 1.6 0 0 0-2.7-1.1 2 2 0 1 1-2.8-2.8A1.6 1.6 0 0 0 2 13a2 2 0 1 1 0-4 1.6 1.6 0 0 0 1-2.7 2 2 0 1 1 2.8-2.8A1.6 1.6 0 0 0 9 4a2 2 0 1 1 4 0 1.6 1.6 0 0 0 2.7 1 2 2 0 1 1 2.8 2.8A1.6 1.6 0 0 0 20 11a2 2 0 1 1 0 4 1.6 1.6 0 0 0-.6 0z" />
      </svg>
    ),
  },
  {
    href: "/about",
    cls: "c-about",
    title: "عن المنصة",
    subtitle: "تعرّف على رؤية وئام وآلية عملها",
    icon: (
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 16v-4M12 8h.01" />
      </svg>
    ),
  },
  {
    href: "/rate",
    cls: "c-rate",
    title: "تقييمي للمنصة",
    subtitle: "شاركنا رأيك لنطوّر الخدمة",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M12 3l2.5 5.5 6 .6-4.5 4 1.3 5.9L12 16l-5.3 3 1.3-5.9-4.5-4 6-.6z" />
      </svg>
    ),
  },
];

function ripple(e: React.MouseEvent<HTMLButtonElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const s = document.createElement("span");
  s.className = "weam-ripple";
  const size = Math.max(r.width, r.height);
  s.style.width = s.style.height = size + "px";
  s.style.left = e.clientX - r.left - size / 2 + "px";
  s.style.top = e.clientY - r.top - size / 2 + "px";
  el.appendChild(s);
  setTimeout(() => s.remove(), 600);
}

export default function ServiceMenu() {
  const router = useRouter();
  return (
    <nav className="flex flex-col gap-3.5">
      {services.map((s) => (
        <button
          key={s.href}
          className={`weam-card ${s.cls}`}
          onClick={(e) => {
            ripple(e);
            router.push(s.href);
          }}
        >
          <span className="ic">{s.icon}</span>
          <span className="tx">
            <b>{s.title}</b>
            <small>{s.subtitle}</small>
          </span>
          <span className="arw">‹</span>
        </button>
      ))}

      <form action="/api/auth/logout" method="post">
        <button type="submit" className="weam-card c-out w-full">
          <span className="ic">
            <svg viewBox="0 0 24 24">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
          </span>
          <span className="tx">
            <b>تسجيل الخروج</b>
            <small>إنهاء الجلسة بأمان</small>
          </span>
          <span className="arw">‹</span>
        </button>
      </form>
    </nav>
  );
}
