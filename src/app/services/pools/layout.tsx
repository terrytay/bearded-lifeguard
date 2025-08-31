import type { Metadata } from "next";

export default function PoolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": "https://sglifeguardservices.com/services/pools#service",
    "name": "Swimming Pool Lifeguard Services Singapore",
    "alternateName": "Pool Lifeguard Services",
    "description": "Professional swimming pool lifeguards in Singapore for residential condos, commercial hotels, schools & private facilities. Certified pool safety supervision available island-wide.",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Bearded Lifeguard",
      "url": "https://sglifeguardservices.com"
    },
    "serviceType": "Swimming Pool Safety Services",
    "serviceOutput": "Water safety supervision and emergency response",
    "areaServed": {
      "@type": "Country",
      "name": "Singapore"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Pool Lifeguard Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Residential Pool Lifeguard",
            "description": "Professional lifeguards for condominium and private residential pools"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service", 
            "name": "Commercial Pool Lifeguard",
            "description": "Certified lifeguards for hotels, resorts and commercial swimming facilities"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "School Pool Lifeguard", 
            "description": "Educational institution swimming pool safety supervision"
          }
        }
      ]
    },
    "image": {
      "@type": "ImageObject",
      "url": "https://sglifeguardservices.com/gallery/pool/pool.jpg",
      "caption": "Professional swimming pool lifeguard services Singapore"
    },
    "brand": {
      "@type": "Brand",
      "name": "Bearded Lifeguard Singapore"
    },
    "audience": {
      "@type": "Audience",
      "audienceType": "Pool owners, facility managers, condominium management"
    },
    "category": "Water Safety Services"
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}