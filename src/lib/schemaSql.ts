// نسخة من supabase/schema.sql لتنفيذها عبر /api/admin/init-db
// (مزدوجة عمداً ليُضمَّن المحتوى في حزمة Vercel serverless)
export const SCHEMA_SQL = String.raw`
DO $$ BEGIN
  CREATE TYPE "Role" AS ENUM ('ADMIN', 'STAFF', 'CUSTOMER');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "Priority" AS ENUM ('NORMAL', 'IMPORTANT', 'ESSENTIAL');
EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE TABLE IF NOT EXISTS "offices" (
  "id"          SERIAL PRIMARY KEY,
  "name"        TEXT NOT NULL,
  "location"    TEXT,
  "address"     TEXT,
  "phone"       TEXT,
  "email"       TEXT,
  "owner"       TEXT,
  "description" TEXT,
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "users" (
  "id"        SERIAL PRIMARY KEY,
  "officeId"  INTEGER REFERENCES "offices"("id"),
  "fullName"  TEXT NOT NULL,
  "username"  TEXT NOT NULL UNIQUE,
  "password"  TEXT NOT NULL,
  "role"      "Role" NOT NULL DEFAULT 'STAFF',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "customers" (
  "id"          SERIAL PRIMARY KEY,
  "name"        TEXT NOT NULL,
  "gender"      TEXT,
  "age"         INTEGER,
  "maritalStat" TEXT,
  "email"       TEXT,
  "address"     TEXT,
  "phoneCall"   TEXT NOT NULL UNIQUE,
  "phoneWhats"  TEXT,
  "noOfSpouses" INTEGER DEFAULT 0,
  "officeId"    INTEGER REFERENCES "offices"("id"),
  "password"    TEXT NOT NULL,
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "partners" (
  "id"          SERIAL PRIMARY KEY,
  "customerId"  INTEGER NOT NULL REFERENCES "customers"("id") ON DELETE CASCADE,
  "name"        TEXT NOT NULL,
  "gender"      TEXT,
  "age"         INTEGER,
  "maritalStat" TEXT,
  "email"       TEXT,
  "address"     TEXT,
  "phoneCall"   TEXT,
  "phoneWhats"  TEXT,
  "serial"      INTEGER NOT NULL DEFAULT 1,
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "assessments" (
  "id"          SERIAL PRIMARY KEY,
  "name"        TEXT NOT NULL,
  "description" TEXT,
  "forGender"   TEXT,
  "active"      BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS "sub_assessments" (
  "id"           SERIAL PRIMARY KEY,
  "assessmentId" INTEGER NOT NULL REFERENCES "assessments"("id") ON DELETE CASCADE,
  "name"         TEXT NOT NULL,
  "description"  TEXT,
  "sortOrder"    INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS "indicators" (
  "id"              SERIAL PRIMARY KEY,
  "subAssessmentId" INTEGER NOT NULL REFERENCES "sub_assessments"("id") ON DELETE CASCADE,
  "indicator"       TEXT NOT NULL,
  "description"     TEXT,
  "showLevel0"      BOOLEAN NOT NULL DEFAULT true,
  "showLevel1"      BOOLEAN NOT NULL DEFAULT true,
  "showLevel2"      BOOLEAN NOT NULL DEFAULT true,
  "showLevel3"      BOOLEAN NOT NULL DEFAULT true,
  "showLevel4"      BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS "analyse_indicators" (
  "id"          SERIAL PRIMARY KEY,
  "indicatorId" INTEGER NOT NULL REFERENCES "indicators"("id") ON DELETE CASCADE,
  "side"        TEXT,
  "priority"    INTEGER,
  "degree"      INTEGER NOT NULL,
  "resultNote"  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "op_assessments" (
  "id"           SERIAL PRIMARY KEY,
  "officeId"     INTEGER REFERENCES "offices"("id"),
  "customerId"   INTEGER NOT NULL REFERENCES "customers"("id") ON DELETE CASCADE,
  "assessmentId" INTEGER NOT NULL REFERENCES "assessments"("id"),
  "date"         TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "note"         TEXT
);

CREATE TABLE IF NOT EXISTS "op_partner_assessments" (
  "id"             SERIAL PRIMARY KEY,
  "opAssessmentId" INTEGER NOT NULL REFERENCES "op_assessments"("id") ON DELETE CASCADE,
  "partnerId"      INTEGER NOT NULL REFERENCES "partners"("id"),
  "partnerName"    TEXT,
  "date"           TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "note"           TEXT,
  "scorePct"       INTEGER,
  "progressPct"    INTEGER NOT NULL DEFAULT 0,
  "aiAdvice"       TEXT
);

CREATE TABLE IF NOT EXISTS "op_det_assessments" (
  "id"                    SERIAL PRIMARY KEY,
  "opPartnerAssessmentId" INTEGER NOT NULL REFERENCES "op_partner_assessments"("id") ON DELETE CASCADE,
  "indicatorId"           INTEGER NOT NULL REFERENCES "indicators"("id"),
  "priority"              "Priority" NOT NULL DEFAULT 'NORMAL',
  "degree"                INTEGER,
  "resultNote"            TEXT,
  "note"                  TEXT,
  "createdAt"             TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "ratings" (
  "id"         SERIAL PRIMARY KEY,
  "customerId" INTEGER NOT NULL REFERENCES "customers"("id") ON DELETE CASCADE,
  "rating"     INTEGER NOT NULL,
  "comment"    TEXT,
  "needHelp"   BOOLEAN NOT NULL DEFAULT false,
  "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "rating_details" (
  "id"        SERIAL PRIMARY KEY,
  "ratingId"  INTEGER NOT NULL REFERENCES "ratings"("id") ON DELETE CASCADE,
  "indicator" TEXT NOT NULL,
  "rating"    INTEGER NOT NULL,
  "comment"   TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

DO $$
DECLARE
  v_office     INTEGER;
  v_customer   INTEGER;
  v_partner    INTEGER;
  v_assessment INTEGER;
  v_sub        INTEGER;
  v_op         INTEGER;
  v_opp        INTEGER;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM "users" WHERE "username" = 'admin') THEN
    INSERT INTO "offices" ("name","phone","email")
    VALUES ('مكتب وئام الرئيسي','0559113059','info@weam.sa')
    RETURNING "id" INTO v_office;

    INSERT INTO "users" ("officeId","fullName","username","password","role")
    VALUES (v_office,'مدير المنصة','admin',
      'pbkdf2$100000$nMN1flg0DE9O61WpaaMs5w==$Is3WsUoO8jRMQQXLSDmbRJB2stzlyMvijPpiSZIxTic=',
      'ADMIN');

    INSERT INTO "customers" ("name","gender","phoneCall","password","officeId","noOfSpouses")
    VALUES ('عبدالاله الاهدل','ذكر','0500000000',
      'pbkdf2$100000$kxXmR63jt3ZXkBlsKQNMUw==$dNo+/8ZPNZb7AYdwyBNRWEs/4GsWosIKFgzqLcvmZSs=',
      v_office,1)
    RETURNING "id" INTO v_customer;

    INSERT INTO "partners" ("customerId","name","gender","serial")
    VALUES (v_customer,'زوجة 1','أنثى',1)
    RETURNING "id" INTO v_partner;

    INSERT INTO "assessments" ("name","forGender")
    VALUES ('أداة قياس مستوى علاقتي بزوجتي (خاص بالرجل)','male')
    RETURNING "id" INTO v_assessment;

    INSERT INTO "sub_assessments" ("assessmentId","name","sortOrder")
    VALUES (v_assessment,'أولاً: المعايير الاجتماعية',1)
    RETURNING "id" INTO v_sub;

    INSERT INTO "indicators" ("subAssessmentId","indicator") VALUES
      (v_sub,'الأخلاق والطباع'),
      (v_sub,'الديانة والعلم'),
      (v_sub,'إكرام الضيوف'),
      (v_sub,'المال والوظيفة'),
      (v_sub,'النسب والمكانة'),
      (v_sub,'تربية الأولاد');

    INSERT INTO "op_assessments" ("officeId","customerId","assessmentId","note")
    VALUES (v_office, v_customer, v_assessment, 'تقييم تجريبي')
    RETURNING "id" INTO v_op;

    INSERT INTO "op_partner_assessments"
      ("opAssessmentId","partnerId","partnerName","note","scorePct","progressPct")
    VALUES (v_op, v_partner, 'زوجة 1', 'تقييم تجريبي مكتمل', 83, 100)
    RETURNING "id" INTO v_opp;

    INSERT INTO "op_det_assessments"
      ("opPartnerAssessmentId","indicatorId","priority","degree","note")
    SELECT v_opp, "id", 'IMPORTANT',
      CASE "indicator"
        WHEN 'الأخلاق والطباع'  THEN 4
        WHEN 'الديانة والعلم'   THEN 4
        WHEN 'إكرام الضيوف'     THEN 2
        WHEN 'المال والوظيفة'   THEN 3
        WHEN 'النسب والمكانة'   THEN 4
        WHEN 'تربية الأولاد'    THEN 3
        ELSE 3
      END,
      'أداء جيد وفقاً للتقييم.'
    FROM "indicators" WHERE "subAssessmentId" = v_sub;

    INSERT INTO "op_assessments" ("officeId","customerId","assessmentId")
    VALUES (v_office, v_customer, v_assessment)
    RETURNING "id" INTO v_op;

    INSERT INTO "op_partner_assessments"
      ("opAssessmentId","partnerId","partnerName","scorePct","progressPct")
    VALUES (v_op, v_partner, 'زوجة 1', 75, 50)
    RETURNING "id" INTO v_opp;

    INSERT INTO "op_det_assessments" ("opPartnerAssessmentId","indicatorId","priority","degree")
    SELECT v_opp, "id", 'NORMAL',
      CASE WHEN row_number() OVER (ORDER BY "id") <= 3 THEN 3 ELSE NULL END
    FROM "indicators" WHERE "subAssessmentId" = v_sub;

    INSERT INTO "ratings" ("customerId","rating","comment","needHelp")
    VALUES (v_customer, 5, 'منصة ممتازة وساعدتني كثيراً.', false);
  END IF;
END $$;
`;
