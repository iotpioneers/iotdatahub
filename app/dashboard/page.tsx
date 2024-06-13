import Projects from "@/components/dashboard/Projects";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import authOptions from "../api/auth/authOptions";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return redirect("/login");
  }
  return (
    <main className="overflow-hidden">
      <h1 className="font-bold ml-8 my-5">Channels</h1>
      <Projects />
    </main>
  );
}
