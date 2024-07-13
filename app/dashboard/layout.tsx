import React from "react";
import DashboardNavigation from "@/components/dashboard/DashboardNavigation";
import { Container } from "@radix-ui/themes";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <DashboardNavigation />
        <main className="flex flex-col flex-gro lg:ml-64 xs:mx-2">
          <Container>{children}</Container>
        </main>
      </body>
    </html>
  );
}
