"use client";

import { useState } from "react";

type Priority = "NORMAL" | "IMPORTANT" | "ESSENTIAL";
type Row = { opDetId: number; name: string; degree: number | null; priority: string; note: string | null };
type Group = { subName: string; rows: Row[] };

const DEGREES = ["معدوم", "نادر", "مقبول", "جيد", "ممتاز"]; // 0..4
const PRIORITIES: { k: Priority; t: string }[] = [
  { k: "NORMAL", t: "عادي" },
  { k: "IMPORTANT", t: "مهم" },
  { k: "ESSENTIAL", t: "ضروري" },
];
const LVL_GRAD = [
  "var(--grad-danger)",
  "linear-gradient(120deg,#FF8E53,#FFC23C)",
  "linear-gradient(120deg,#FFC23C,#22C58B)",
  "linear-gradient(120deg,#22C58B,#16B8A6)",
  "var(--grad-green)",
];

function barColor(p: number) {
  if (p < 40) return "var(--grad-danger)";
  if (p < 75) return "var(--grad-warm)";
  return "var(--grad-green)";
}

export default function AssessmentDetail({
  header,
  groups: initialGroups,
}: {
  header: {
    assessmentName: string;
    partnerName: string;
    date: string;
    scorePct: number | null;
    progressPct: number;
  };
  groups: Group[];
}) {
  const [groups, setGroups] = useState<Group[]>(initialGroups);
  const [score, setScore] = useState<number | null>(header.scorePct);
  const [progress, setProgress] = useState<number>(header.progressPct);
  const [editing, setEditing] = useState<Row | null>(null);
  const [draftDegree, setDraftDegree] = useState<number | null>(null);
  const [draftPriority, setDraftPriority] = useState<Priority>("NORMAL");
  const [draftNote, setDraftNote] = useState("");
  const [saving, setSaving] = useState(false);

  function openEditor(row: Row) {
    setEditing(row);
    setDraftDegree(row.degree);
    setDraftPriority((row.priority as Priority) || "NORMAL");
    setDraftNote(row.note || "");
  }

  async function save() {
    if (!editing) return;
    setSaving(true);
    try {
      const res = await fetch("/api/assessment/detail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          opDetId: editing.opDetId,
          degree: draftDegree,
          priority: draftPriority,
          note: draftNote,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setGroups((gs) =>
          gs.map((g) => ({
            ...g,
            rows: g.rows.map((r) =>
              r.opDetId === editing.opDetId
                ? { ...r, degree: draftDegree, priority: draftPriority, note: draftNote }
                : r
            ),
          }))
        );
        setProgress(data.progressPct);
        setScore(data.scorePct);
        setEditing(null);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="weam-wrap-wide">
      {/* الترويسة */}
      <div className="weam-glass mb-5 p-6">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-black leading-7">{header.assessmentName}</h2>
            <p className="mt-1 text-sm" style={{ color: "var(--txt-dim)" }}>
              طرف التقييم: {header.partnerName} ·{" "}
              {new Date(header.date).toLocaleDateString("ar-SA")}
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black" style={{ color: "var(--green)" }}>
              {score != null ? score + "%" : "—"}
            </div>
            <div className="text-xs" style={{ color: "var(--txt-mut)" }}>
              نتيجة التقييم
            </div>
          </div>
        </div>
        <div className="mb-1 flex items-center justify-between text-xs" style={{ color: "var(--txt-dim)" }}>
          <span>نسبة التقدّم</span>
          <span className="font-black">{progress}%</span>
        </div>
        <div className="weam-progress">
          <i style={{ width: `${progress}%`, background: barColor(progress) }} />
        </div>
      </div>

      {/* الجوانب والمؤشرات */}
      {groups.map((g, gi) => (
        <div key={gi} className="mb-5">
          <div className="weam-section-title">{g.subName}</div>
          <div className="flex flex-col gap-2.5">
            {g.rows.map((r) => (
              <button
                key={r.opDetId}
                onClick={() => openEditor(r)}
                className="weam-glass flex items-center gap-3 p-4 text-right transition hover:bg-white/15"
              >
                <span
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-lg font-black text-white"
                  style={{ background: r.degree != null ? LVL_GRAD[r.degree] : "rgba(255,255,255,.12)" }}
                >
                  {r.degree != null ? r.degree : "—"}
                </span>
                <span className="flex-1">
                  <b className="block font-extrabold">{r.name}</b>
                  <small style={{ color: "var(--txt-mut)" }}>
                    {r.degree != null ? DEGREES[r.degree] : "لم يُقيَّم بعد"}
                  </small>
                </span>
                <span className="weam-badge">{PRIORITIES.find((p) => p.k === r.priority)?.t || "عادي"}</span>
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* المُحرّر (Modal) */}
      {editing && (
        <div
          className="fixed inset-0 z-[9000] flex items-center justify-center p-4"
          style={{ background: "rgba(6,10,30,.55)", backdropFilter: "blur(6px)" }}
          onClick={() => setEditing(null)}
        >
          <div
            className="w-full max-w-[520px] overflow-hidden"
            style={{
              borderRadius: "var(--r-lg)",
              background: "linear-gradient(160deg,rgba(28,34,70,.97),rgba(16,20,46,.97))",
              border: "1px solid var(--glass-bd)",
              boxShadow: "var(--sh-lg)",
              animation: "weamRise .3s var(--ease) both",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b p-5" style={{ borderColor: "var(--line)" }}>
              <b className="text-lg">{editing.name}</b>
              <button
                onClick={() => setEditing(null)}
                className="grid h-9 w-9 place-items-center rounded-full"
                style={{ background: "var(--glass)", border: "1px solid var(--glass-bd)" }}
              >
                ✕
              </button>
            </div>

            <div className="p-5">
              <label className="weam-label">الأولوية</label>
              <div className="mb-5 flex gap-2">
                {PRIORITIES.map((p) => (
                  <button
                    key={p.k}
                    onClick={() => setDraftPriority(p.k)}
                    className="flex-1 rounded-full py-2.5 text-sm font-extrabold transition"
                    style={
                      draftPriority === p.k
                        ? { background: "var(--grad-primary)", color: "#fff" }
                        : { background: "rgba(255,255,255,.1)", color: "var(--txt-dim)" }
                    }
                  >
                    {p.t}
                  </button>
                ))}
              </div>

              <label className="weam-label">الدرجة</label>
              <div className="mb-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {DEGREES.map((d, i) => (
                  <button
                    key={i}
                    onClick={() => setDraftDegree(i)}
                    className="rounded-2xl py-3 text-sm font-extrabold transition"
                    style={
                      draftDegree === i
                        ? { background: LVL_GRAD[i], color: "#fff", boxShadow: "var(--sh)" }
                        : { background: "rgba(255,255,255,.1)", color: "var(--txt-dim)" }
                    }
                  >
                    ({i}) {d}
                  </button>
                ))}
              </div>

              <label className="weam-label">ملاحظة / نص النتيجة</label>
              <textarea
                className="weam-input"
                rows={4}
                value={draftNote}
                onChange={(e) => setDraftNote(e.target.value)}
                placeholder="اكتب ملاحظتك هنا…"
              />
            </div>

            <div className="flex gap-3 border-t p-5" style={{ borderColor: "var(--line)" }}>
              <button className="weam-btn success block" onClick={save} disabled={saving}>
                {saving ? "جارٍ الحفظ…" : "حفظ"}
              </button>
              <button className="weam-btn ghost" onClick={() => setEditing(null)}>
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
