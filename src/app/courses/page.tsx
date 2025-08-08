// src/app/courses/page.tsx
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
    <main className="bg-[#fafafa]">
      {/* Header */}
      <section className="px-4 py-16 md:py-20">
        <div className="mx-auto max-w-7xl">
          <span className="inline-flex items-center rounded-full bg-[#FFEDD5] px-3 py-1 text-xs font-semibold text-[#FF6633]">
            COURSES
          </span>

          <h1 className="mt-4 text-3xl md:text-5xl font-bold text-[#20334F]">
            Lifesaving Courses
          </h1>

          <div className="mt-4 max-w-3xl space-y-3 text-[#384152]">
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
      </section>

      {/* Pathways */}
      <section className="px-4 pb-8">
        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Become a certified lifeguard */}
          <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[#20334F]">
              To become a certified lifeguard
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-[#384152]">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#FF6633]" />
                <span>Lifesaving 1, Lifesaving 2, Lifesaving 3 award</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#FF6633]" />
                <span>Bronze Medallion &amp; CPR award</span>
              </li>
            </ul>
          </article>

          {/* Other awards */}
          <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[#20334F]">
              Other Awards
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-[#384152]">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#FF6633]" />
                <span>Pool Lifeguard Award</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#FF6633]" />
                <span>SLSS International Pool Lifeguard award</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#FF6633]" />
                <span>Award of Merit (AM), Senior Resuscitation award</span>
              </li>
            </ul>
          </article>

          {/* Open Water */}
          <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[#20334F]">
              Open Water Awards
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-[#384152]">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#FF6633]" />
                <span>Bronze Cross award</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#FF6633]" />
                <span>Silver Cross award</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#FF6633]" />
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
