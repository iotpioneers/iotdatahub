import type { Metadata } from "next";
import "./auth.css";
import { ToastProvider } from "@/components/ui/toast-provider";
import HydrationFix from "@/components/HydrationFix";
import ClientRootLayout from "@/app/ClientRootLayout";
import ClientOnly from "@/components/ClientOnly";

export const metadata: Metadata = {
  title: "IoTDataHub - Auth",
  description: "Signin to your account or create a new account",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50  overflow-hidden">
          <ClientRootLayout>
            <ClientOnly>
              <ToastProvider>
                <HydrationFix>{children}</HydrationFix>
              </ToastProvider>
            </ClientOnly>
          </ClientRootLayout>
        </div>
      </body>
    </html>
  );
}
