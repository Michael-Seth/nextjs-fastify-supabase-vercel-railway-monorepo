import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Toaster } from "sonner";

import { OfflineBanner } from "@/components/OfflineBanner";

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME ?? "My SaaS",
  description: "Built with create-fastify-supabase",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <OfflineBanner />
          
          {children}
          <Toaster richColors position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
