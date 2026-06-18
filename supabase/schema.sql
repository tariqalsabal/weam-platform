-- ============================================================
-- منصة وئام — سكيمة Postgres جاهزة لـ Supabase (بلا Node)
-- الصقها في: Supabase > SQL Editor > New query > Run
-- أسماء الأعمدة بصيغة camelCase ومقتبسة لتطابق Prisma Client تماماً.
-- ============================================================

-- ---------- الأنواع (Enums) ----------
DO $$ BEGIN
  CREATE TYPE "Role" AS ENUM ('ADMIN', 'STAFF', 'CUSTOMER');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "Priority" AS ENUM ('NORMAL', 'IMPORTANT', 'ESSENTIAL');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ---------- الجداول ----------
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

-- ---------- بيانات تجريبية (Seed) ----------
-- حسابات: admin / admin123    و    العميل 0500000000 / 123456
DO $$
DECLARE
  v_office     INTEGER;
  v_customer   INTEGER;
  v_assessment INTEGER;
  v_sub        INTEGER;
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
    VALUES (v_customer,'زوجة 1','أنثى',1);

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
  END IF;
END $$;
