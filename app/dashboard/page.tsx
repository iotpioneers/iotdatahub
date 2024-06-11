import Projects from "@/components/dashboard/Projects";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return redirect("/login");
  }
  return (
    <main className="overflow-hidden">
      <h1 className="font-bold ml-8 my-5">My Channels</h1>
      <Projects />
    </main>
  );
}
