import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";

import { Inter } from "next/font/google";
import PageTransition from "@/components/PageTransition";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Bearded Lifeguard - Singapore Lifeguard Services",
  description:
    "Concerned with the water safety at your aquatic premises or events? We provide professional water safety advice for swimming pools / beaches and events.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <meta
        name="google-site-verification"
        content="39pOh18bzvxnzwwTb8jR9mFa0Axcsd4xjO2iZj2WAio"
      />
      <body
        className={
          "flex flex-col justify-between bg-gradient-to-br from-slate-50 to-blue-50 relative select-none " +
          inter.className
        }
      >
        <Header />
        <PageTransition>{children}</PageTransition>
        <Footer />
      </body>
    </html>
  );
}
