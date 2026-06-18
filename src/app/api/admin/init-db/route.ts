import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { SCHEMA_SQL } from "@/lib/schemaSql";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// عميل مباشر (غير مجمّع) لتنفيذ DDL بأمان
const direct = new PrismaClient({
  datasourceUrl: process.env.POSTGRES_URL_NON_POOLING || process.env.DIRECT_URL,
});

// يقسّم الـ SQL إلى جُمل مع احترام كتل $$ ... $$ (DO blocks)
function splitStatements(sql: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inDollar = false;
  for (let i = 0; i < sql.length; i++) {
    if (sql[i] === "$" && sql[i + 1] === "$") {
      inDollar = !inDollar;
      cur += "$$";
      i++;
      continue;
    }
    if (sql[i] === ";" && !inDollar) {
      if (cur.trim()) out.push(cur.trim());
      cur = "";
      continue;
    }
    cur += sql[i];
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

async function run() {
  const statements = splitStatements(SCHEMA_SQL);
  const results: { i: number; ok: boolean; error?: string }[] = [];
  for (let i = 0; i < statements.length; i++) {
    try {
      await direct.$executeRawUnsafe(statements[i]);
      results.push({ i, ok: true });
    } catch (e) {
      results.push({ i, ok: false, error: e instanceof Error ? e.message : String(e) });
    }
  }
  const failed = results.filter((r) => !r.ok);
  return { total: statements.length, ok: results.length - failed.length, failed };
}

function authorized(req: Request) {
  const key = new URL(req.url).searchParams.get("key");
  return !!process.env.AUTH_SECRET && key === process.env.AUTH_SECRET;
}

export async function GET(req: Request) {
  if (!authorized(req)) return NextResponse.json({ error: "غير مصرّح" }, { status: 401 });
  try {
    const summary = await run();
    return NextResponse.json({ ok: true, ...summary });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "خطأ" }, { status: 500 });
  }
}

export const POST = GET;
