"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"customer" | "staff">("customer");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password, mode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "تعذّر تسجيل الدخول");
      } else {
        router.push(data.redirect || "/");
        router.refresh();
      }
    } catch {
      setError("تعذّر الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative z-[1] flex min-h-screen items-center justify-center p-6">
      <span className="weam-blob" style={{ width: 90, height: 90, background: "var(--gold)", top: "16%", right: "14%" }} />
      <span className="weam-blob" style={{ width: 120, height: 120, background: "var(--pink)", bottom: "12%", left: "12%" }} />

      <form
        onSubmit={onSubmit}
        className="weam-glass relative w-full max-w-[430px] overflow-hidden p-8"
        style={{ borderRadius: "var(--r-xl)", boxShadow: "var(--sh-lg)", animation: "weamRise .6s var(--ease) both" }}
      >
        {/* الترويسة */}
        <div className="mb-6 text-center">
          <div
            className="mx-auto mb-3 grid h-24 w-24 place-items-center rounded-[26px] bg-white"
            style={{ boxShadow: "0 12px 30px rgba(21,195,178,.45)" }}
          >
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 21s-7-4.4-9.3-8.4C1 9.4 2.6 6 6 6c2 0 3.2 1.2 4 2.4C10.8 7.2 12 6 14 6c3.4 0 5 3.4 3.3 6.6C19 16.6 12 21 12 21z"
                fill="#15C3B2"
              />
              <circle cx="9.3" cy="11" r="1.4" fill="#fff" />
              <circle cx="14.7" cy="11" r="1.4" fill="#fff" />
            </svg>
          </div>
          <h1 className="m-0 text-2xl font-black">
            <span
              style={{
                background: "linear-gradient(90deg,#fff,var(--gold),#fff,var(--teal),#fff)",
                backgroundSize: "300% 100%",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                animation: "weamShimmer 6s linear infinite",
              }}
            >
              مرحبا بك معنا
            </span>
          </h1>
        </div>

        {/* تبديل نوع الدخول */}
        <div className="mb-5 flex gap-2 rounded-full border p-1.5" style={{ borderColor: "var(--line)", background: "var(--glass-2)" }}>
          {([
            { k: "customer", t: "عميل" },
            { k: "staff", t: "موظف / إدارة" },
          ] as const).map((o) => (
            <button
              type="button"
              key={o.k}
              onClick={() => setMode(o.k)}
              className="flex-1 rounded-full py-2.5 text-sm font-extrabold transition"
              style={
                mode === o.k
                  ? { background: "var(--grad-primary)", color: "#fff", boxShadow: "var(--sh)" }
                  : { color: "var(--txt-dim)" }
              }
            >
              {o.t}
            </button>
          ))}
        </div>

        <div className="weam-field">
          <label className="weam-label">{mode === "customer" ? "هاتف العميل" : "اسم المستخدم"}</label>
          <input
            className="weam-input"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder={mode === "customer" ? "05xxxxxxxx" : "admin"}
            autoComplete="username"
            inputMode={mode === "customer" ? "tel" : "text"}
          />
        </div>

        <div className="weam-field">
          <label className="weam-label">كلمة المرور</label>
          <div className="relative">
            <input
              className="weam-input"
              type={showPwd ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              style={{ paddingLeft: 44 }}
            />
            <button
              type="button"
              onClick={() => setShowPwd((s) => !s)}
              className="absolute left-2 top-1/2 -translate-y-1/2 px-2 text-sm"
              style={{ color: "var(--txt-mut)" }}
              aria-label="إظهار كلمة المرور"
            >
              {showPwd ? "🙈" : "👁"}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-3 rounded-xl px-4 py-3 text-sm font-bold" style={{ background: "rgba(255,91,110,.18)", border: "1px solid rgba(255,91,110,.4)" }}>
            {error}
          </div>
        )}

        <button type="submit" className="weam-btn success block" disabled={loading} style={{ minHeight: 50 }}>
          {loading ? "جارٍ الدخول…" : "تسجيل الدخول"}
        </button>

        {mode === "customer" && (
          <p className="mt-4 text-center text-sm" style={{ color: "var(--txt-dim)" }}>
            ليس لديك حساب؟{" "}
            <a href="/register" className="font-extrabold" style={{ color: "var(--teal)" }}>
              تسجيل حساب جديد
            </a>
          </p>
        )}

        <p className="mt-3 text-center text-xs" style={{ color: "var(--txt-mut)" }}>
          منصة وئام للإصلاح الأسري © 2025
        </p>
      </form>
    </main>
  );
}
