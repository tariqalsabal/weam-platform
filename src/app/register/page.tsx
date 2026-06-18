"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, password }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || "تعذّر إنشاء الحساب");
      else {
        router.push(data.redirect || "/home");
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
      <form
        onSubmit={onSubmit}
        className="weam-glass relative w-full max-w-[430px] overflow-hidden p-8"
        style={{ borderRadius: "var(--r-xl)", boxShadow: "var(--sh-lg)", animation: "weamRise .6s var(--ease) both" }}
      >
        <h1 className="mb-6 text-center text-2xl font-black">إنشاء حساب جديد</h1>

        <div className="weam-field">
          <label className="weam-label">الاسم الكامل</label>
          <input className="weam-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="عبدالله ..." />
        </div>
        <div className="weam-field">
          <label className="weam-label">رقم الهاتف</label>
          <input className="weam-input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="05xxxxxxxx" inputMode="tel" />
        </div>
        <div className="weam-field">
          <label className="weam-label">كلمة المرور</label>
          <input className="weam-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="6 أحرف على الأقل" />
        </div>

        {error && (
          <div className="mb-3 rounded-xl px-4 py-3 text-sm font-bold" style={{ background: "rgba(255,91,110,.18)", border: "1px solid rgba(255,91,110,.4)" }}>
            {error}
          </div>
        )}

        <button type="submit" className="weam-btn success block" disabled={loading} style={{ minHeight: 50 }}>
          {loading ? "جارٍ الإنشاء…" : "تسجيل حساب"}
        </button>

        <p className="mt-4 text-center text-sm" style={{ color: "var(--txt-dim)" }}>
          لديك حساب؟{" "}
          <Link href="/login" className="font-extrabold" style={{ color: "var(--teal)" }}>
            تسجيل الدخول
          </Link>
        </p>
      </form>
    </main>
  );
}
