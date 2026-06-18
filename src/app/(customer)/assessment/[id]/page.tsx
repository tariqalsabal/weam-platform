import Placeholder from "@/components/Placeholder";

export default async function AssessmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <Placeholder
      title={`تقييم رقم ${id}`}
      desc="عرض/تعبئة مؤشرات التقييم والنتائج — الخطوة التالية."
      back="/assessments"
    />
  );
}
