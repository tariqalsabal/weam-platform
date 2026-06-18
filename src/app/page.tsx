import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export default async function RootIndex() {
  const session = await getSession();
  if (!session) redirect("/login");
  redirect(session.role === "customer" ? "/home" : "/admin");
}
