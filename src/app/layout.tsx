import type { Metadata } from "next";
import "./globals.css";

import { Inter } from "next/font/google";
import ConditionalLayout from "@/components/ConditionalLayout";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Bearded Lifeguard",
    default: "Bearded Lifeguard - Singapore Lifeguard Services",
  },
  description:
    "Professional lifeguard services in Singapore for swimming pools, events, pool parties and open water activities. Expert water safety management, certified lifeguards, and comprehensive aquatic safety solutions for your peace of mind.",
  keywords: [
    "lifeguard",
    "singapore",
    "water safety",
    "swimming pool",
    "event safety",
    "open water",
    "sg",
    "lifeguards",
    "services",
    "service",
  ],
  authors: [{ name: "Bearded Lifeguard" }],
  openGraph: {
    title: "Bearded Lifeguard - Singapore Lifeguard Services",
    description: "Professional water safety services in Singapore",
    type: "website",
  },
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
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <body
        className={
          "flex flex-col justify-between bg-gradient-to-br from-slate-50 to-blue-50 relative select-none " +
          inter.className
        }
      >
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
