import type { Metadata } from "next";
import ClientRootLayout from "@/app/ClientRootLayout";

import "../globals.css";
import { Container } from "@radix-ui/themes";

import Header from "@/components/Home/components/Header";

export const metadata: Metadata = {
  title: "IoTDataCenter",
  description:
    "Your one-stop destination for seamless and efficient IoT Plug and Play services. Our cutting-edge solutions empower businesses to effortlessly connect, manage, and optimize their IoT devices, enabling a smarter and more connected world.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientRootLayout>
          <Header />
          <main>
            <Container>{children}</Container>
          </main>
        </ClientRootLayout>
      </body>
    </html>
  );
}
