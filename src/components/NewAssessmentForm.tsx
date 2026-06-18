"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Opt = { id: number; name: string };

export default function NewAssessmentForm({
  assessments,
  partners,
}: {
  assessments: Opt[];
  partners: Opt[];
}) {
  const router = useRouter();
  const [assessmentId, setAssessmentId] = useState<number | "">(assessments[0]?.id ?? "");
  const [partnerId, setPartnerId] = useState<number | "">(partners[0]?.id ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function start() {
    if (!assessmentId || !partnerId) {
      setError("اختر الأداة والطرف");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/assessment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assessmentId, partnerId }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || "تعذّر الإنشاء");
      else router.push(`/assessment/${data.id}`);
    } catch {
      setError("تعذّر الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  }

  const noPartners = partners.length === 0;
  const noAssessments = assessments.length === 0;

  return (
    <div className="weam-glass p-6">
      <div className="weam-field">
        <label className="weam-label">أداة التقييم</label>
        <select
          className="weam-input"
          value={assessmentId}
          onChange={(e) => setAssessmentId(Number(e.target.value))}
          disabled={noAssessments}
        >
          {noAssessments && <option>لا توجد أدوات متاحة</option>}
          {assessments.map((a) => (
            <option key={a.id} value={a.id} className="text-black">
              {a.name}
            </option>
          ))}
        </select>
      </div>

      <div className="weam-field">
        <label className="weam-label">طرف التقييم</label>
        <select
          className="weam-input"
          value={partnerId}
          onChange={(e) => setPartnerId(Number(e.target.value))}
          disabled={noPartners}
        >
          {noPartners && <option>أضِف أطراف أسرتك من الإعدادات أولاً</option>}
          {partners.map((p) => (
            <option key={p.id} value={p.id} className="text-black">
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div
          className="mb-3 rounded-xl px-4 py-3 text-sm font-bold"
          style={{ background: "rgba(255,91,110,.18)", border: "1px solid rgba(255,91,110,.4)" }}
        >
          {error}
        </div>
      )}

      <button
        className="weam-btn success block"
        onClick={start}
        disabled={loading || noPartners || noAssessments}
      >
        {loading ? "جارٍ الإنشاء…" : "بدء التقييم"}
      </button>
    </div>
  );
}
