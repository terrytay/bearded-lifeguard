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
    template: "%s | Bearded Lifeguard - Singapore's #1 Lifeguard Services",
    default:
      "Bearded Lifeguard - Singapore's Premier Lifeguard Services | Pool, Event & Water Safety",
  },
  description:
    "Singapore's leading lifeguard services provider. Professional certified lifeguards for swimming pools, events, pool parties, open water activities & water safety training. Available island-wide in SG.",
  keywords: [
    "singapore lifeguard services",
    "sg lifeguard",
    "lifeguard singapore",
    "lifeguards singapore",
    "lifeguard services singapore",
    "lifeguard service singapore",
    "lifeguardservices sg",
    "lifeguardservice singapore",
    "water safety singapore",
    "swimming pool lifeguard sg",
    "event lifeguard singapore",
    "pool party lifeguard singapore",
    "open water lifeguard sg",
    "lifeguard courses singapore",
    "water safety training sg",
    "professional lifeguards singapore",
    "certified lifeguards sg",
    "lifeguard hire singapore",
    "lifeguard booking singapore",
    "aquatic safety singapore",
    "pool safety sg",
    "beach lifeguard singapore",
    "private pool lifeguard sg",
    "event safety singapore",
    "water rescue singapore",
    "lifesaving courses sg",
  ],
  authors: [{ name: "Bearded Lifeguard Singapore" }],
  creator: "Bearded Lifeguard",
  publisher: "Bearded Lifeguard Singapore",
  category: "Water Safety Services",
  classification: "Professional Lifeguard Services",
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
  alternates: {
    canonical: "https://sglifeguardservices.com",
  },
  openGraph: {
    title: "Bearded Lifeguard - Singapore's Premier Lifeguard Services",
    description:
      "Professional certified lifeguards for pools, events, and water safety in Singapore. Available island-wide with 24/7 booking.",
    type: "website",
    locale: "en_SG",
    url: "https://sglifeguardservices.com",
    siteName: "Bearded Lifeguard Singapore",
    images: [
      {
        url: "https://sglifeguardservices.com/og-image-about.jpg",
        width: 1200,
        height: 630,
        alt: "Professional lifeguards providing water safety services in Singapore pools and events",
        type: "image/jpeg",
      },
      {
        url: "https://sglifeguardservices.com/services1.jpg",
        width: 800,
        height: 600,
        alt: "Certified lifeguard on duty at swimming pool in Singapore",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bearded Lifeguard - Singapore's Premier Lifeguard Services",
    description:
      "Professional certified lifeguards for pools, events, and water safety in Singapore.",
    images: ["https://sglifeguardservices.com/og-image-about.jpg"],
    creator: "@BeardedLifeguardSG",
  },
  verification: {
    google: "39pOh18bzvxnzwwTb8jR9mFa0Axcsd4xjO2iZj2WAio",
  },
  other: {
    "geo.region": "SG",
    "geo.placename": "Singapore",
    "geo.position": "1.3521;103.8198",
    ICBM: "1.3521, 103.8198",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://sglifeguardservices.com/#business",
    name: "Bearded Lifeguard",
    alternateName: "Bearded Lifeguard Singapore",
    description:
      "Singapore's leading lifeguard services provider. Professional certified lifeguards for swimming pools, events, pool parties, open water activities & water safety training.",
    url: "https://sglifeguardservices.com",
    telephone: "+65-8200-6021",
    email: "sales@sglifeguardservices.com",
    address: {
      "@type": "PostalAddress",
      addressCountry: "SG",
      addressRegion: "Singapore",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "1.3521",
      longitude: "103.8198",
    },
    areaServed: {
      "@type": "Country",
      name: "Singapore",
    },
    serviceArea: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: "1.3521",
        longitude: "103.8198",
      },
      geoRadius: "50000",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Lifeguard Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Swimming Pool Lifeguard Services",
            description:
              "Professional lifeguards for private and public swimming pools in Singapore",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Event Lifeguard Services",
            description:
              "Certified lifeguards for corporate events, parties and special occasions",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Pool Party Lifeguard Services",
            description:
              "Safety supervision for pool parties and recreational activities",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Open Water Lifeguard Services",
            description:
              "Professional water safety for beaches, lakes and open water activities",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "EducationalOccupationalProgram",
            name: "Lifeguard Training Courses",
            description:
              "Water safety and lifesaving certification courses in Singapore",
          },
        },
      ],
    },
    sameAs: [
      "https://www.facebook.com/BeardedLifeguardSG",
      "https://www.instagram.com/beardedlifeguardsg",
    ],
    logo: {
      "@type": "ImageObject",
      url: "https://sglifeguardservices.com/logo.png",
      width: "200",
      height: "200",
    },
    image: {
      "@type": "ImageObject",
      url: "https://sglifeguardservices.com/og-image-about.jpg",
      width: "1200",
      height: "630",
    },
    priceRange: "$$",
    currenciesAccepted: "SGD",
    paymentAccepted: "PayNow, Cash, Bank Transfer",
    openingHours: "Mo-Su 06:00-23:00",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "127",
    },
  };

  return (
    <html lang="en" itemScope itemType="https://schema.org/LocalBusiness">
      <head>
        <meta
          name="google-site-verification"
          content="39pOh18bzvxnzwwTb8jR9mFa0Axcsd4xjO2iZj2WAio"
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
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
