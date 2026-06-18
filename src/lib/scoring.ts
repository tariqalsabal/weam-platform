import { Priority } from "@prisma/client";

// أوزان الأولوية (قابلة للضبط): عادي/مهم/ضروري
export function priorityWeight(p: Priority): number {
  switch (p) {
    case "ESSENTIAL":
      return 4;
    case "IMPORTANT":
      return 3;
    default:
      return 2;
  }
}

export const PRIORITY_LABELS: Record<Priority, string> = {
  NORMAL: "عادي",
  IMPORTANT: "مهم",
  ESSENTIAL: "ضروري",
};

export const DEGREE_LABELS = ["معدوم", "نادر", "مقبول", "جيد", "ممتاز"]; // 0..4

// النسبة % محسوبة على المؤشرات المُجابة فقط، ونسبة التقدّم على الكل
export function computeTotals(rows: { degree: number | null; priority: Priority }[]): {
  progressPct: number;
  scorePct: number | null;
} {
  const total = rows.length;
  const answered = rows.filter((r) => r.degree != null);
  const progressPct = total ? Math.round((answered.length / total) * 100) : 0;

  let num = 0;
  let den = 0;
  for (const r of answered) {
    const w = priorityWeight(r.priority);
    num += (r.degree as number) * w;
    den += 4 * w;
  }
  const scorePct = den ? Math.round((num / den) * 100) : null;
  return { progressPct, scorePct };
}
