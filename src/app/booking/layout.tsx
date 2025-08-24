import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book Lifeguards Now - Bearded Lifeguard",
  description:
    "Book professional certified lifeguards in Singapore instantly. Real-time pricing, PayNow payment, and immediate confirmation. Pool, event, party, and open water lifeguard services available 24/7.",
  keywords: [
    "book lifeguards singapore",
    "hire lifeguards online",
    "lifeguard booking system",
    "instant lifeguard booking",
    "24/7 lifeguard services",
    "emergency lifeguard booking",
    "pool lifeguard hire",
    "event lifeguard booking",
    "professional lifeguard services",
    "certified lifeguards singapore",
  ],
  authors: [{ name: "Bearded Lifeguard" }],
  metadataBase: new URL("https://sglifeguardservices.com"),
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
    url: "https://sglifeguardservices.com/booking",
    title: "Book Professional Lifeguards Singapore - Bearded Lifeguard",
    description:
      "Book certified lifeguards instantly with real-time pricing and PayNow payment. Pool, event, party, and open water lifeguard services available now.",
    siteName: "Bearded Lifeguard",
  },
  alternates: {
    canonical: "https://sglifeguardservices.com/booking",
  },
  other: {
    "geo.region": "SG",
    "geo.placename": "Singapore",
    "geo.position": "1.3521;103.8198",
    ICBM: "1.3521, 103.8198",
  },
};

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
