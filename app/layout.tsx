import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "./utils/SessionProvider";
import Navbar from "@/components/Home/Navbar";
import Footer from "@/components/Home/Footer";
import { Container, Theme, ThemePanel } from "@radix-ui/themes";
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
            <div className="mb-3">
              <Navbar />
            </div>
            <main className="relative overflow-hidden">
              <Container>{children}</Container>
            </main>
          </Theme>
        </AuthProvider>
      </body>
    </html>
  );
}
