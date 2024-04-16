import Projects from "@/components/dashboard/Projects";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  console.log(session);
  if (!session) {
    return redirect("/login");
  }
  return (
    <main className="overflow-hidden">
      <Projects />
    </main>
  );
}
