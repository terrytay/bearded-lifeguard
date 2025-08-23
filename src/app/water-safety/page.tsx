// src/app/water-safety/page.tsx
import { Cta } from "@/components/Cta";
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
    <main className="bg-[#fafafa]">
      {/* Header */}
      <section className="px-4 pt-14 md:pt-20 pb-10">
        <div className="mx-auto max-w-7xl">
          <span className="inline-flex items-center rounded-full bg-[#FFEDD5] px-3 py-1 text-xs font-semibold text-[#FF6633]">
            WATER SAFETY
          </span>

          <h1 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight text-[#20334F]">
            Water Safety
          </h1>

          <p className="mt-4 max-w-3xl text-[#384152]">
            With years of experience under our belt, we have the right people to
            assist you in any questions that you may have. Bearded Lifeguard
            provides consultation service for your events in or near the water,
            your swimming pool or any other water related activities. Our safety
            manager has been put in charge of water safety for events such as
            swim marathon in the open water and night beach parties.
          </p>
        </div>
      </section>

      {/* What we help with */}
      <section className="px-4 pb-8">
        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-6">
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
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-[#20334F]">
                {card.title}
              </h2>
              <ul className="mt-4 space-y-2 text-sm text-[#384152]">
                {card.items.map((it) => (
                  <li key={it} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#FF6633]" />
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

      {/* Call to Action */}
      <div className="px-4">
        <div className="mx-auto max-w-7xl">
          <Cta />
        </div>
      </div>
    </main>
  );
}
