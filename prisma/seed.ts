import { PrismaClient, Role, Priority } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hash = (p: string) => bcrypt.hashSync(p, 10);

  // مكتب
  const office = await prisma.office.create({
    data: { name: "مكتب وئام الرئيسي", phone: "0559113059", email: "info@weam.sa" },
  });

  // مدير
  await prisma.user.create({
    data: {
      officeId: office.id,
      fullName: "مدير المنصة",
      username: "admin",
      password: hash("admin123"),
      role: Role.ADMIN,
    },
  });

  // عميل تجريبي
  const customer = await prisma.customer.create({
    data: {
      name: "عبدالاله الاهدل",
      gender: "ذكر",
      phoneCall: "0500000000",
      password: hash("123456"),
      officeId: office.id,
      noOfSpouses: 1,
      partners: {
        create: [{ name: "زوجة 1", gender: "أنثى", serial: 1 }],
      },
    },
    include: { partners: true },
  });

  // أداة تقييم + جانب + مؤشرات
  const assessment = await prisma.assessment.create({
    data: {
      name: "أداة قياس مستوى علاقتي بزوجتي (خاص بالرجل)",
      forGender: "male",
      subs: {
        create: [
          {
            name: "أولاً: المعايير الاجتماعية",
            sortOrder: 1,
            indicators: {
              create: [
                { indicator: "الأخلاق والطباع" },
                { indicator: "الديانة والعلم" },
                { indicator: "إكرام الضيوف" },
                { indicator: "المال والوظيفة" },
                { indicator: "النسب والمكانة" },
                { indicator: "تربية الأولاد" },
              ],
            },
          },
        ],
      },
    },
  });

  console.log("Seed done:", {
    office: office.id,
    customer: customer.id,
    assessment: assessment.id,
    sample: { admin: "admin / admin123", customer: "0500000000 / 123456" },
  });
  void Priority;
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
