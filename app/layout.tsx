import type { Metadata } from "next";
import "./globals.css";
import { Container, Theme } from "@radix-ui/themes";
import AuthProvider from "./auth/Provider";

export const metadata: Metadata = {
  title: "IoT service",
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
        <AuthProvider>
          <Theme accentColor="violet">
            <main className="relative overflow-hidden pt-20">
              <Container>{children}</Container>
            </main>
          </Theme>
        </AuthProvider>
      </body>
    </html>
  );
}
