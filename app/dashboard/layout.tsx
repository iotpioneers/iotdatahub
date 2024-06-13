import "@radix-ui/themes/styles.css";
import Navbar from "@/components/dashboard/Navbar";
import DashboardSidebar from "@/components/dashboard/Sidebar";
import { Theme } from "@radix-ui/themes";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <Navbar />
      <main className="flex">
        <aside className="bg-slate-200 p-5 mr-5">
          <DashboardSidebar />
        </aside>
        <Theme>
          <div>{children}</div>
        </Theme>
      </main>
    </section>
  );
}
