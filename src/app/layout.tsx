import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";

import { Inter } from "next/font/google";

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
      <body
        className={
          "flex flex-col justify-between relative bg-neutral-50 select-none " +
          inter.className
        }
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
