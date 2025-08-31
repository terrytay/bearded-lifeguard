import { Hero } from "@/components/Hero";
import { Metadata } from "next";
import { homePageJsonLd } from "./home-layout";

export const metadata: Metadata = {
  title: "Professional Lifeguard Services Singapore | Pool, Event & Water Safety | Bearded Lifeguard",
  description:
    "Singapore's #1 professional lifeguard services provider. Certified lifeguards for swimming pools, events, pool parties & open water activities. Water safety courses & training available island-wide. Book now!",
  keywords: [
    "lifeguard services singapore",
    "singapore lifeguard services", 
    "sg lifeguard",
    "lifeguards singapore",
    "lifeguardservices sg",
    "lifeguardservice singapore",
    "professional lifeguards singapore",
    "water safety singapore", 
    "swimming pool lifeguard sg",
    "event lifeguard singapore",
    "pool party lifeguard sg",
    "open water lifeguard singapore",
    "lifeguard courses singapore",
    "water safety training sg",
    "certified lifeguards singapore",
    "lifeguard hire singapore",
    "lifeguard booking sg",
    "aquatic safety singapore",
    "pool safety sg",
    "beach lifeguard singapore",
    "singapore water safety"
  ],
  metadataBase: new URL("https://sglifeguardservices.com"),
  authors: [{ name: "Bearded Lifeguard" }],
  creator: "Bearded Lifeguard",
  publisher: "Bearded Lifeguard",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_SG",
    url: "https://sglifeguardservices.com",
    title: "Professional Lifeguard Services Singapore - Bearded Lifeguard",
    description:
      "Singapore's premier professional lifeguard services for pools, events, and open water. Certified lifeguards, water safety courses, and expert consultation.",
    siteName: "Bearded Lifeguard",
    images: [
      {
        url: "https://sglifeguardservices.com/og-image-about.jpg",
        width: 1200,
        height: 630,
        alt: "Bearded Lifeguard - Professional Lifeguard Services Singapore",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Professional Lifeguard Services Singapore - Bearded Lifeguard",
    description:
      "Singapore's premier professional lifeguard services for pools, events, and open water. Certified lifeguards available now.",
    images: ["https://sglifeguardservices.com/og-image-about.jpg"],
  },
  alternates: {
    canonical: "https://sglifeguardservices.com",
  },
  other: {
    "geo.region": "SG",
    "geo.placename": "Singapore",
    "geo.position": "1.3521;103.8198",
    ICBM: "1.3521, 103.8198",
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homePageJsonLd) }}
      />
      <main className="page-container">
        <section className="page-content">
          <div className="content-wrapper">
            <Hero />
          </div>
        </section>
      </main>
    </>
  );
}
