import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Bearded Lifeguard for professional lifeguard services in Singapore. Contact us for swimming pool safety, event lifeguarding, and water safety solutions.",
  keywords: [
    "contact lifeguard singapore",
    "lifeguard services inquiry",
    "swimming pool safety contact",
    "event lifeguard booking",
    "water safety singapore",
    "professional lifeguards contact",
  ],
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
    title: "Contact Us - Bearded Lifeguard",
    description:
      "Contact Bearded Lifeguard for professional lifeguard services in Singapore",
    type: "website",
  },
  alternates: {
    canonical: "https://sglifeguardservices.com/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
