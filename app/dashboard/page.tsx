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
      <h1>Dashboard</h1>
    </main>
  );
}
