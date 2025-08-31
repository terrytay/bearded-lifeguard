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
  openGraph: {
    title: "Contact Us - Bearded Lifeguard",
    description: "Contact Bearded Lifeguard for professional lifeguard services in Singapore",
    type: "website",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}