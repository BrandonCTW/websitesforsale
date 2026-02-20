import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WebsitesForSale — Buy & Sell Websites Directly",
  description: "Browse websites for sale. No broker fees. Contact sellers directly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.className} antialiased bg-background text-foreground min-h-screen`}>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <ScrollToTop />
      </body>
    </html>
  );
}
