"use client";

import { usePathname } from "next/navigation";
import Navbar from "./navbar";
import Footer from "./footer";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAuthPage = pathname.startsWith("/auth");
  const isAdminPage = pathname.startsWith("/admin");
  const isHomePage = pathname === "/";

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <>
      {!isAdminPage && <Navbar />}

      <main
        className={
          !isAdminPage && !isHomePage ? "pt-[74px] lg:pt-[82px]" : ""
        }
      >
        {children}
      </main>

      {!isAdminPage && <Footer />}
    </>
  );
}