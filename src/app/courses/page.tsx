// src/app/courses/page.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lifesaving Courses - Bearded Lifeguard",
  description: "SLSS certified lifesaving courses in Singapore. Learn lifeguarding, CPR, and water safety skills. From Lifesaving 1 to Bronze Medallion, Pool Lifeguard certification, and Open Water awards. Become a certified lifeguard.",
  keywords: [
    "lifesaving courses singapore",
    "SLSS lifeguard training",
    "lifeguard certification singapore",
    "CPR courses singapore",
    "swimming lifesaving training",
    "bronze medallion course",
    "pool lifeguard training",
    "open water lifeguard course",
    "water safety courses",
    "lifeguard instructor singapore"
  ],
  authors: [{ name: "Bearded Lifeguard" }],
  creator: "Bearded Lifeguard",
  publisher: "Bearded Lifeguard",
  openGraph: {
    type: "website",
    locale: "en_SG",
    url: "https://sglifeguardservices.com/courses",
    title: "SLSS Lifesaving Courses Singapore - Bearded Lifeguard",
    description: "SLSS certified lifesaving courses - from Lifesaving 1 to Bronze Medallion and Pool Lifeguard certification. Learn lifeguarding and water safety skills in Singapore.",
    siteName: "Bearded Lifeguard",
    images: [
      {
        url: "/og-image-courses.jpg",
        width: 1200,
        height: 630,
        alt: "SLSS Lifesaving Courses Singapore - Bearded Lifeguard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lifesaving Courses - Bearded Lifeguard",
    description: "SLSS certified lifesaving courses in Singapore. Learn lifeguarding, CPR, and water safety skills. Become a certified lifeguard.",
    images: ["/og-image-courses.jpg"],
  },
  alternates: {
    canonical: "https://sglifeguardservices.com/courses",
  },
};

export default function CoursesPage() {
  // Using <img> for these remote images (avoids Next/Image remote config/mixed-content issues)
  const badges = [
    {
      src: "/slss-lifesaving-1-award-badge.jpg",
      alt: "SLSS Lifesaving 1 Award Badge",
    },
    {
      src: "/slss-lifesaving-2-award-badge.jpg",
      alt: "SLSS Lifesaving 2 Award Badge",
    },
    {
      src: "/slss-lifesaving-3-award-badge.jpg",
      alt: "SLSS Lifesaving 3 Award Badge",
    },
    {
      src: "/slss-bronze-medallion-award-badge.jpg",
      alt: "SLSS Bronze Medallion Award Badge",
    },
    {
      src: "/slss-resuscitation-award-badge.jpg",
      alt: "SLSS Resuscitation (CPR) Award Badge",
    },
    {
      src: "/slss-pool-lifeguard-award-badge.jpg",
      alt: "SLSS Pool Lifeguard Award Badge",
    },
    {
      src: "/slss-award-of-merit-badge.jpg",
      alt: "SLSS Award of Merit Badge",
    },
    {
      src: "/slss-senior-resuscitation-award-badge.jpg",
      alt: "SLSS Senior Resuscitation Award Badge",
    },
    {
      src: "/slss-bronze-cross-award-badge.jpg",
      alt: "SLSS Bronze Cross Award Badge",
    },
    {
      src: "/slss-silver-cross-award-badge.jpg",
      alt: "SLSS Silver Cross Award Badge",
    },
    {
      src: "/slss-patrol-lifeguard-award-badge.jpg",
      alt: "SLSS Patrol Lifeguard Award Badge",
    },
  ];

  return (
    <main className="page-container">
      {/* Header */}
      <section className="page-content">
        <div className="content-wrapper">
          <div className="modern-hero">
            <span className="inline-flex items-center rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-[#FF6633] border border-orange-200">
              COURSES
            </span>

            <h1 className="mt-6 text-3xl md:text-5xl font-bold text-modern-primary">
              Lifesaving Courses
            </h1>

            <div className="mt-6 max-w-3xl space-y-4 text-modern-secondary text-lg">
              <p>
                As part of our initiative to reduce the number of drownings, we
                conduct lifesaving courses as well. We have a certified lifesaving
                teacher who is able to conduct these courses.
              </p>
              <p>
                All the lifesaving courses conducted are according to the syllabus
                provided by the{" "}
                <strong>Singapore Lifesaving Society (SLSS)</strong>. Hence, all
                certifications are also awarded by SLSS.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pathways */}
      <section className="page-content">
        <div className="content-wrapper feature-grid">
          {/* Become a certified lifeguard */}
          <article className="modern-card-hover p-8">
            <h2 className="text-xl font-semibold text-modern-primary">
              To become a certified lifeguard
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-modern-light">
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-[#FF6633]" />
                <span>Lifesaving 1, Lifesaving 2, Lifesaving 3 award</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-[#FF6633]" />
                <span>Bronze Medallion &amp; CPR award</span>
              </li>
            </ul>
          </article>

          {/* Other awards */}
          <article className="modern-card-hover p-8">
            <h2 className="text-xl font-semibold text-modern-primary">
              Other Awards
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-modern-light">
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-[#FF6633]" />
                <span>Pool Lifeguard Award</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-[#FF6633]" />
                <span>SLSS International Pool Lifeguard award</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-[#FF6633]" />
                <span>Award of Merit (AM), Senior Resuscitation award</span>
              </li>
            </ul>
          </article>

          {/* Open Water */}
          <article className="modern-card-hover p-8">
            <h2 className="text-xl font-semibold text-modern-primary">
              Open Water Awards
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-modern-light">
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-[#FF6633]" />
                <span>Bronze Cross award</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-[#FF6633]" />
                <span>Silver Cross award</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-[#FF6633]" />
                <span>Patrol Lifeguard award</span>
              </li>
            </ul>
          </article>
        </div>
      </section>

      {/* Badges (responsive grid on desktop, scroll-snap row on mobile) */}
      <section className="px-4 pb-20">
        <div className="mx-auto max-w-7xl">
          <h3 className="text-xl md:text-2xl font-semibold text-[#20334F] text-center">
            SLSS Awards & Badges
          </h3>

          {/* Mobile: horizontal snap strip */}
          <div className="mt-6 md:hidden -mx-4 px-4 overflow-x-auto">
            <ul className="flex gap-4 snap-x snap-mandatory">
              {badges.map((b, i) => (
                <li
                  key={i}
                  className="snap-start shrink-0 w-40 rounded-xl border border-gray-200 bg-white p-3 shadow-sm"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={b.src}
                    alt={b.alt}
                    className="h-24 w-full object-contain"
                    loading="lazy"
                    decoding="async"
                  />
                </li>
              ))}
            </ul>
          </div>

          {/* Desktop: tidy grid */}
          <ul className="mt-6 hidden md:grid grid-cols-3 lg:grid-cols-5 gap-4">
            {badges.map((b, i) => (
              <li
                key={i}
                className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm flex items-center justify-center"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={b.src}
                  alt={b.alt}
                  className="h-24 w-auto object-contain"
                  loading="lazy"
                  decoding="async"
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

    </main>
  );
}
