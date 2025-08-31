// This file contains home page specific structured data
// It's imported by page.tsx to add JSON-LD to the home page

export const homePageJsonLd = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "Service"],
  "@id": "https://sglifeguardservices.com/#homepage",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://sglifeguardservices.com/"
  },
  "name": "Bearded Lifeguard Singapore",
  "alternateName": ["Bearded Lifeguard", "Singapore Lifeguard Services"],
  "description": "Singapore's premier professional lifeguard services provider for swimming pools, events, pool parties & open water activities.",
  "url": "https://sglifeguardservices.com",
  "telephone": "+65-8200-6021",
  "email": "sales@sglifeguardservices.com",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "SG",
    "addressRegion": "Singapore"
  },
  "geo": {
    "@type": "GeoCoordinates", 
    "latitude": "1.3521",
    "longitude": "103.8198"
  },
  "areaServed": {
    "@type": "Country",
    "name": "Singapore"
  },
  "serviceArea": {
    "@type": "GeoCircle",
    "geoMidpoint": {
      "@type": "GeoCoordinates",
      "latitude": "1.3521", 
      "longitude": "103.8198"
    },
    "geoRadius": "50000"
  },
  "priceRange": "$$",
  "currenciesAccepted": "SGD",
  "paymentAccepted": ["PayNow", "Cash", "Bank Transfer"],
  "openingHours": "Mo-Su 06:00-23:00",
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Professional Lifeguard Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Swimming Pool Lifeguard Services",
          "description": "Professional lifeguards for residential and commercial swimming pools in Singapore",
          "category": "Pool Safety"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service", 
          "name": "Event Lifeguard Services",
          "description": "Certified lifeguards for corporate events, weddings and special occasions",
          "category": "Event Safety"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Pool Party Lifeguard Services",
          "description": "Safety supervision for pool parties and recreational swimming events", 
          "category": "Party Safety"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Open Water Lifeguard Services",
          "description": "Professional water safety for beaches, lakes and open water activities",
          "category": "Beach Safety"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "EducationalOccupationalProgram",
          "name": "Lifeguard Training Courses",
          "description": "Water safety and lifesaving certification courses in Singapore",
          "category": "Training"
        }
      }
    ]
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "127",
    "bestRating": "5",
    "worstRating": "1"
  },
  "image": [
    {
      "@type": "ImageObject",
      "url": "https://sglifeguardservices.com/og-image-about.jpg",
      "width": "1200",
      "height": "630",
      "caption": "Professional lifeguards providing water safety services in Singapore"
    },
    {
      "@type": "ImageObject", 
      "url": "https://sglifeguardservices.com/services1.jpg",
      "width": "800",
      "height": "600", 
      "caption": "Certified lifeguard on duty at swimming pool"
    }
  ],
  "logo": {
    "@type": "ImageObject",
    "url": "https://sglifeguardservices.com/logo.png",
    "width": "200",
    "height": "200"
  },
  "sameAs": [
    "https://www.facebook.com/BeardedLifeguardSG",
    "https://www.instagram.com/beardedlifeguardsg"
  ],
  "knowsAbout": [
    "Water Safety",
    "Swimming Pool Safety", 
    "Lifeguarding",
    "Water Rescue",
    "CPR",
    "First Aid",
    "Aquatic Safety",
    "Beach Safety",
    "Event Safety"
  ],
  "slogan": "Singapore's Premier Lifeguard Services"
};