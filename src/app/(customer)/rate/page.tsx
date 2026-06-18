"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RatePage() {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [needHelp, setNeedHelp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    if (!rating) {
      setError("اختر عدد النجوم");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/rate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment, needHelp }),
      });
      if (res.ok) setDone(true);
      else {
        const d = await res.json().catch(() => ({}));
        setError(d.error || "تعذّر الإرسال");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="weam-wrap">
      <div className="weam-section-title">تقييمي للمنصة</div>
      <div className="weam-glass p-8 text-center">
        {done ? (
          <>
            <div className="mb-3 text-5xl">🎉</div>
            <h2 className="mb-2 text-xl font-black">شكراً لك!</h2>
            <p className="mb-5 text-sm" style={{ color: "var(--txt-dim)" }}>
              تم استلام تقييمك، نقدّر مشاركتك في تطوير المنصة.
            </p>
            <button className="weam-btn" onClick={() => router.push("/home")}>
              الرجوع للرئيسية
            </button>
          </>
        ) : (
          <>
            <p className="mb-4 text-sm" style={{ color: "var(--txt-dim)" }}>
              ما مدى رضاك عن منصة وئام؟
            </p>
            <div className="mb-5 flex justify-center gap-2" dir="ltr">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => setRating(n)}
                  onMouseEnter={() => setHover(n)}
                  onMouseLeave={() => setHover(0)}
                  className="text-4xl transition"
                  style={{ filter: (hover || rating) >= n ? "none" : "grayscale(1) opacity(.4)", transform: (hover || rating) >= n ? "scale(1.12)" : "none" }}
                  aria-label={`${n} نجوم`}
                >
                  ⭐
                </button>
              ))}
            </div>

            <textarea
              className="weam-input mb-4 text-right"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="ملاحظاتك (اختياري)…"
            />

            <label className="mb-5 flex items-center justify-center gap-2 text-sm" style={{ color: "var(--txt-dim)" }}>
              <input type="checkbox" checked={needHelp} onChange={(e) => setNeedHelp(e.target.checked)} style={{ width: 18, height: 18, accentColor: "var(--teal)" }} />
              أرغب بتواصل من المختص
            </label>

            {error && (
              <div className="mb-3 rounded-xl px-4 py-3 text-sm font-bold" style={{ background: "rgba(255,91,110,.18)", border: "1px solid rgba(255,91,110,.4)" }}>
                {error}
              </div>
            )}

            <button className="weam-btn success block" onClick={submit} disabled={loading}>
              {loading ? "جارٍ الإرسال…" : "إرسال التقييم"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
