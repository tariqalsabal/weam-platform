import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import Topbar from "@/components/Topbar";

export default async function CustomerLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="relative z-[1] min-h-screen">
      <Topbar name={session.name} />
      {children}
    </div>
  );
}
