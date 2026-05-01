import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

import QueryProvider from "../providers/query-provider";
import SiteLayout from "../components/layout/site-layout";
import { AuthProvider } from "../context/auth-context";
import { LanguageProvider } from "@/context/language-context";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: "Taui Travel",
  description: "Smart travel platform across Egypt",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.className} bg-white text-black`}>
        <LanguageProvider>
          <QueryProvider>
            <AuthProvider>
              <SiteLayout>{children}</SiteLayout>
            </AuthProvider>
          </QueryProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}