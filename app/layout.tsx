import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "./utils/SessionProvider";
import Navbar from "@/components/Home/Navbar";
import Footer from "@/components/Home/Footer";
import { Theme } from "@radix-ui/themes";

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
        <Theme>
          <Navbar />
          <main className="relative overflow-hidden">{children}</main>
          <Footer />
        </Theme>
      </body>
    </html>
    // <html lang="en">
    //   <body className="relative">
    //     <SessionProvider>{children}</SessionProvider>
    //   </body>
    // </html>
  );
}
