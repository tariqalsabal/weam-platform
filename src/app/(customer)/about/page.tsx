export default function AboutPage() {
  const features = [
    "تحليل موضوعي للحياة الزوجية بناءً على بيانات تفاعلية من الزوجين.",
    "ربط تقارير القياس بنظام ذكاء اصطناعي لتقديم توصيات دقيقة.",
    "إطار عملي لتقييم مدى تحقيق احتياجات الزوجين.",
    "سهولة الاستخدام وإمكانية تطبيقها في برامج الإصلاح الأسري.",
  ];

  return (
    <div className="weam-wrap">
      <section className="weam-hero mb-5">
        <h1>عن منصة وئام</h1>
        <p>
          منصة وئام للإصلاح الأسري أداة رقمية مدعومة بالذكاء الاصطناعي تهدف إلى تقييم العلاقات الزوجية وتحسينها من
          خلال فهم الاحتياجات الفطرية للزوجين وتقديم توصيات عملية لتعزيز الوئام بينهما.
        </p>
      </section>

      <div className="weam-glass mb-5 p-6">
        <div className="weam-section-title">كيف تعمل المنصة؟</div>
        <p className="text-sm leading-8" style={{ color: "var(--txt-dim)" }}>
          تعتمد المنصة على تقييم ثلاثي لأهمية كل حاجة لكل فرد، ومقياس خماسي (0–4) لتحديد مستوى تحقيق هذه الاحتياجات
          في شريك الحياة. يُحلَّل ذلك لإعداد تقارير تفصيلية بتوصيات عملية لكل زوج وزوجة.
        </p>
      </div>

      <div className="weam-glass p-6">
        <div className="weam-section-title">مميزات المنصة</div>
        <ul className="flex flex-col gap-3">
          {features.map((f, i) => (
            <li key={i} className="flex items-start gap-3 text-sm" style={{ color: "var(--txt-dim)" }}>
              <span style={{ color: "var(--teal)" }}>◆</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-center text-xs" style={{ color: "var(--txt-mut)" }}>
          مسجّلة لدى الهيئة السعودية للملكية الفكرية باسم د. سهيل محمد قاسم — © 2025
        </p>
      </div>
    </div>
  );
}
