import { Cta } from "@/components/Cta";

// app/about/page.tsx (or components/AboutUs.tsx)
export default function AboutUs() {
  return (
    <main className="bg-[#fafafa]">
      {/* Hero / Intro */}
      <section className="px-4 py-16 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6">
            <span className="inline-flex items-center rounded-full bg-[#FFEDD5] px-3 py-1 text-xs font-semibold text-[#FF6633]">
              ABOUT US
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-[#20334F]">
            Your Safety, Our Priority
          </h1>

          <p className="mt-4 max-w-3xl text-[#384152]">
            Drowning is the <strong>3rd leading cause</strong> of unintentional
            injury death worldwide (WHO, 2018). There are an estimated{" "}
            <strong>360,000</strong> annual drowning deaths. Children, males,
            and individuals are most at risk.
          </p>

          {/* Stat card */}
          <div className="mt-6 inline-flex gap-4">
            <div className="rounded-xl border border-gray-200 bg-white px-5 py-3">
              <p className="text-sm text-gray-500">Global Drowning Deaths</p>
              <p className="text-2xl font-semibold text-[#20334F]">
                360,000 / year
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white px-5 py-3">
              <p className="text-sm text-gray-500">Founded</p>
              <p className="text-2xl font-semibold text-[#20334F]">2017</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="px-4 pb-12">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-orange-200 bg-white p-6 md:p-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#FF6633]">
              Our Mission
            </p>
            <p className="mt-2 text-xl md:text-2xl font-semibold text-[#20334F]">
              To reduce this number.
            </p>
            <p className="mt-3 text-[#384152]">
              It is not enough if it were only us doing it. Our approach is to
              educate the public through swimming lessons, conduct water safety
              talks, and provide professionally trained lifeguards to designated
              swimming pools.
            </p>
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className="px-4 pb-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl md:text-3xl font-bold text-[#20334F]">
            Our Approach
          </h2>
          <p className="mt-3  text-[#384152]">
            We believe that through education and raising awareness, the message
            of water safety can be widely spread faster and further.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {/* Education */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-[#20334F]">
                Education
              </h3>
              <p className="mt-2 text-[#384152]">
                Swimming lessons, water safety talks, lifesaving courses.
              </p>
              <ul className="mt-4 space-y-2 text-[#384152]">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-[#FF6633]" />
                  Structured lessons for all ages
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-[#FF6633]" />
                  School & community safety talks
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-[#FF6633]" />
                  Lifesaving certifications
                </li>
              </ul>
            </div>

            {/* Awareness */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-[#20334F]">
                Awareness
              </h3>
              <p className="mt-2 text-[#384152]">
                Lifeguard services for pools, beaches, events & parties. With
                presence, comes awareness.
              </p>
              <ul className="mt-4 space-y-2 text-[#384152]">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-[#FF6633]" />
                  Certified on-duty lifeguards
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-[#FF6633]" />
                  Beach & open-water coverage
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-[#FF6633]" />
                  Events & private functions
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
