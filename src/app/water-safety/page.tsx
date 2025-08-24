// src/app/water-safety/page.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Water Safety Consultation - Bearded Lifeguard",
  description: "Professional water safety consultation services in Singapore. Expert advice for pools, open water events, and aquatic facilities. Risk assessment, safety management, and emergency planning by certified water safety specialists.",
  keywords: [
    "water safety consultation singapore",
    "pool safety consultation",
    "open water safety planning",
    "aquatic facility safety audit",
    "water safety management",
    "swimming pool safety assessment",
    "event water safety planning",
    "emergency action plan review",
    "water safety specialist singapore",
    "junior lifesaving singapore"
  ],
  authors: [{ name: "Bearded Lifeguard" }],
  creator: "Bearded Lifeguard",
  publisher: "Bearded Lifeguard",
  openGraph: {
    type: "website",
    locale: "en_SG",
    url: "https://sglifeguardservices.com/water-safety",
    title: "Water Safety Consultation Singapore - Bearded Lifeguard",
    description: "Professional water safety consultation for pools, open water events, and aquatic facilities. Risk assessment and safety management by certified specialists.",
    siteName: "Bearded Lifeguard",
    images: [
      {
        url: "/og-image-water-safety.jpg",
        width: 1200,
        height: 630,
        alt: "Water Safety Consultation Singapore - Bearded Lifeguard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Water Safety Consultation - Bearded Lifeguard",
    description: "Professional water safety consultation for pools, open water events, and aquatic facilities. Expert risk assessment and safety management.",
    images: ["/og-image-water-safety.jpg"],
  },
  alternates: {
    canonical: "https://sglifeguardservices.com/water-safety",
  },
};

export default function WaterSafetyPage() {
  const gallery = [
    {
      src: "/watersafety1.jpg",
      alt: "Kids learning water safety with instructors",
    },
    {
      src: "/watersafety2.jpg",
      alt: "Open-water safety training demonstration",
    },
  ];

  return (
    <main className="page-container">
      {/* Header */}
      <section className="page-content">
        <div className="content-wrapper">
          <div className="modern-hero">
            <span className="inline-flex items-center rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-[#FF6633] border border-orange-200">
              WATER SAFETY
            </span>

            <h1 className="mt-6 text-3xl md:text-5xl font-bold tracking-tight text-modern-primary">
              Water Safety
            </h1>

            <p className="mt-6 max-w-3xl text-modern-secondary text-lg">
              With years of experience under our belt, we have the right people to
              assist you in any questions that you may have. Bearded Lifeguard
              provides consultation service for your events in or near the water,
              your swimming pool or any other water related activities. Our safety
              manager has been put in charge of water safety for events such as
              swim marathon in the open water and night beach parties.
            </p>
          </div>
        </div>
      </section>

      {/* What we help with */}
      <section className="page-content">
        <div className="content-wrapper feature-grid">
          {[
            {
              title: "Pools & Facilities",
              items: [
                "Operational checks & supervision plans",
                "Patron flow & signage audits",
                "Emergency action plan reviews",
              ],
            },
            {
              title: "Events Near Water",
              items: [
                "Risk assessment & coverage planning",
                "On-site safety management",
                "Volunteer/crew safety briefings",
              ],
            },
            {
              title: "Open Water",
              items: [
                "Route design & marshal positioning",
                "Rescue access & comms protocols",
                "Night event safety considerations",
              ],
            },
          ].map((card) => (
            <article
              key={card.title}
              className="modern-card-hover p-8"
            >
              <h2 className="text-lg font-semibold text-modern-primary">
                {card.title}
              </h2>
              <ul className="mt-4 space-y-3 text-sm text-modern-light">
                {card.items.map((it) => (
                  <li key={it} className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-[#FF6633]" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* Coming soon */}
      <section className="px-4 pb-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-orange-200 bg-orange-50 p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-[#20334F] text-center">
              Coming Soon — Junior Lifesaving
            </h3>
            <p className="mt-3 text-center text-[#384152]">
              In our efforts to raise awareness of water safety, we have a
              program in the pipeline to promote lifesaving from a very young
              age (junior lifesaving). If you’re interested to sign your
              child(ren) up, email{" "}
              <a
                href="mailto:sales@sglifeguardservices.com"
                className="font-medium text-[#FF6633] underline-offset-2 hover:underline"
              >
                sales@sglifeguardservices.com
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Gallery: horizontal snap on mobile, grid on desktop */}
      <section className="px-4 pb-16">
        <div className="mx-auto max-w-7xl">
          <h3 className="text-lg md:text-xl font-semibold text-[#20334F] text-center">
            Water Safety in Action
          </h3>

          {/* Mobile strip */}
          <div className="mt-6 md:hidden -mx-4 px-4 overflow-x-auto">
            <ul className="flex gap-4 snap-x snap-mandatory">
              {gallery.map((g, i) => (
                <li
                  key={i}
                  className="snap-start shrink-0 w-80 rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={g.src}
                    alt={g.alt}
                    className="h-48 w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </li>
              ))}
            </ul>
          </div>

          {/* Desktop grid */}
          <ul className="mt-6 hidden md:grid grid-cols-2 gap-6">
            {gallery.map((g, i) => (
              <li
                key={i}
                className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={g.src}
                  alt={g.alt}
                  className="h-64 w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </li>
            ))}
          </ul>

          <p className="mt-3 text-xs text-gray-500 text-center">
            Photos from:{" "}
            <a
              href="http://www.redlandcitybulletin.com.au/story/4338989/raby-bay-nippers-to-get-a-little-intensive/"
              className="underline underline-offset-2"
            >
              redlandcitybulletin.com.au
            </a>
          </p>
        </div>
      </section>

    </main>
  );
}
