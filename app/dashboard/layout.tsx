import "@radix-ui/themes/styles.css";
import Navbar from "@/components/dashboard/Navbar";
import { Theme } from "@radix-ui/themes";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <Theme>
        <Navbar />

        {children}
      </Theme>
    </section>
  );
}
