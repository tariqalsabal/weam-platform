import Link from "next/link";

export default function Placeholder({
  title,
  desc,
  back = "/home",
}: {
  title: string;
  desc?: string;
  back?: string;
}) {
  return (
    <div className="weam-wrap">
      <div className="weam-glass p-8 text-center" style={{ animation: "weamRise .5s var(--ease) both" }}>
        <div className="mb-3 text-4xl">🚧</div>
        <h2 className="mb-2 text-xl font-black">{title}</h2>
        <p className="mb-5 text-sm" style={{ color: "var(--txt-dim)" }}>
          {desc || "هذه الصفحة قيد الإنشاء — سنبنيها في الخطوة التالية."}
        </p>
        <Link href={back} className="weam-btn">
          الرجوع
        </Link>
      </div>
    </div>
  );
}
