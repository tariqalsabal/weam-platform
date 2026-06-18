"use client";

import { useState } from "react";

export default function Topbar({ name }: { name: string }) {
  const [open, setOpen] = useState(false);
  const initial = (name?.trim()?.[0] as string) || "و";

  return (
    <header className="weam-topbar">
      <div className="weam-brand">
        <span className="weam-logo">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 21s-7-4.4-9.3-8.4C1 9.4 2.6 6 6 6c2 0 3.2 1.2 4 2.4C10.8 7.2 12 6 14 6c3.4 0 5 3.4 3.3 6.6C19 16.6 12 21 12 21z"
              fill="#15C3B2"
            />
            <circle cx="9.3" cy="11" r="1.4" fill="#fff" />
            <circle cx="14.7" cy="11" r="1.4" fill="#fff" />
          </svg>
        </span>
        <span className="hidden sm:inline">منصة وئام للإصلاح الأسري</span>
      </div>

      <div className="relative">
        <button className="weam-user" onClick={() => setOpen((o) => !o)}>
          <span className="av">{initial}</span>
          <span>{name}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
        {open && (
          <div
            className="weam-glass absolute left-0 top-[120%] z-20 w-44 overflow-hidden p-1"
            style={{ borderRadius: "var(--r-sm)" }}
          >
            <form action="/api/auth/logout" method="post">
              <button
                type="submit"
                className="w-full rounded-lg px-4 py-2.5 text-right text-sm font-bold transition hover:bg-white/10"
              >
                تسجيل الخروج
              </button>
            </form>
          </div>
        )}
      </div>
    </header>
  );
}
