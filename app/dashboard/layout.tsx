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
    <section className="block">
      <Theme>
        <Navbar />
        <main className="flex w-full gap-2">
          <aside className="bg-white w-1/10 border-solid p-5 mr-5">
            <DashboardSidebar />
          </aside>
          <div className="relative">{children}</div>
        </main>
      </Theme>
    </section>
  );
}
