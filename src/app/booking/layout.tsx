import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book Lifeguard Services Singapore - Instant Online Booking | Professional Water Safety",
  description:
    "Book certified lifeguards online in Singapore. Professional water safety for swimming pools, events, pool parties & open water. Instant booking, transparent pricing, available island-wide. Starting from $21/hour.",
  keywords: [
    "book lifeguard singapore",
    "hire lifeguard sg", 
    "lifeguard booking singapore",
    "swimming pool lifeguard hire sg",
    "event lifeguard booking singapore",
    "pool party lifeguard sg",
    "open water lifeguard hire singapore",
    "certified lifeguard singapore",
    "professional lifeguard services sg",
    "water safety booking singapore",
    "lifeguard service online booking sg",
    "emergency lifeguard singapore",
    "lifeguard hire near me sg",
    "singapore lifeguard booking platform",
    "instant lifeguard booking sg",
    "lifeguardservices singapore booking",
    "lifeguardservice sg hire",
    "sg lifeguard booking system",
    "singapore water safety services",
    "professional lifeguards singapore hire"
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
    title: "Book Lifeguard Services Singapore - Instant Online Booking",
    description:
      "Professional certified lifeguards available for immediate booking in Singapore. Swimming pools, events, parties & open water safety. Starting from $21/hour.",
    siteName: "Bearded Lifeguard Singapore",
    images: [
      {
        url: "https://sglifeguardservices.com/services2.jpg",
        width: 800,
        height: 600,
        alt: "Professional lifeguard booking platform Singapore - instant online reservations",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Book Professional Lifeguards in Singapore - Instant Booking",
    description: "Certified lifeguards for pools, events & water safety. Book online now with transparent pricing.",
    images: ["https://sglifeguardservices.com/services2.jpg"],
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
