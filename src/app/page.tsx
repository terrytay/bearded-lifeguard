import { Hero } from "@/components/Hero";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Professional Lifeguard Services Singapore - Bearded Lifeguard",
  description: "Singapore's premier professional lifeguard services for pools, events, and open water. Certified lifeguards, water safety courses, and expert consultation. Book now for reliable water safety solutions.",
  keywords: [
    "lifeguard services Singapore",
    "professional lifeguards",
    "pool lifeguards",
    "event lifeguards",
    "water safety",
    "lifeguard courses",
    "swimming pool safety",
    "certified lifeguards",
    "aquatic safety",
    "open water lifeguards"
  ],
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
    description: "Singapore's premier professional lifeguard services for pools, events, and open water. Certified lifeguards, water safety courses, and expert consultation.",
    siteName: "Bearded Lifeguard",
    images: [
      {
        url: "/og-image-home.jpg",
        width: 1200,
        height: 630,
        alt: "Bearded Lifeguard - Professional Lifeguard Services Singapore",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Professional Lifeguard Services Singapore - Bearded Lifeguard",
    description: "Singapore's premier professional lifeguard services for pools, events, and open water. Certified lifeguards available now.",
    images: ["/og-image-home.jpg"],
  },
  alternates: {
    canonical: "https://sglifeguardservices.com",
  },
  other: {
    "geo.region": "SG",
    "geo.placename": "Singapore",
    "geo.position": "1.3521;103.8198",
    "ICBM": "1.3521, 103.8198",
  },
};

export default function Home() {
  return (
    <main className="page-container">
      <section className="page-content">
        <div className="content-wrapper">
          <Hero />
        </div>
      </section>
    </main>
  );
}
