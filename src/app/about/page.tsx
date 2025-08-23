// app/about/page.tsx
import { logos } from "@/content/Content";
import Image from "next/image";
import { Cta } from "@/components/Cta";

export default function AboutUs() {
  return (
    <main className="bg-[#fafafa]">
      {/* Intro */}
      <section className="px-4 py-16 md:py-20">
        <div className="mx-auto max-w-7xl">
          <span className="inline-flex items-center rounded-full bg-[#FFEDD5] px-3 py-1 text-xs font-semibold text-[#FF6633]">
            ABOUT US
          </span>

          <h1 className="mt-4 text-3xl md:text-5xl font-bold text-[#20334F]">
            Bearded Lifeguard
          </h1>

          <p className="mt-4 max-w-3xl text-[#384152]">
            Drowning is the 3<sup>rd</sup> leading cause of unintentional injury
            death worldwide (WHO, 2018). There are an estimated 360,000 annual
            drowning deaths. Children, males, and individuals are most at risk.
          </p>

          <p className="mt-3 font-semibold text-[#20334F]">
            OUR MISSION — To reduce this number.
          </p>

          <p className="mt-3 max-w-3xl text-[#384152]">
            It’s not enough if it were only us doing it. Our approach is to
            educate the public through swimming lessons, conduct water safety
            talks, and provide professionally trained lifeguards to designated
            pools.
          </p>
        </div>
      </section>

      {/* Approach: Education & Awareness */}
      <section className="px-4 pb-12">
        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-6">
          <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl md:text-2xl font-semibold text-[#20334F]">
              Education
            </h2>
            <p className="mt-2 text-[#384152]">
              Swimming lessons, water safety talks, lifesaving courses.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#FF6633]" />
                <span>Learn-to-swim & fundamentals</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#FF6633]" />
                <span>Water safety talks for schools & organizations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#FF6633]" />
                <span>Lifesaving courses & CPR training</span>
              </li>
            </ul>
          </article>

          <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl md:text-2xl font-semibold text-[#20334F]">
              Awareness
            </h2>
            <p className="mt-2 text-[#384152]">
              Lifeguard services across pools, beaches, events & parties. With
              presence, comes awareness.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#FF6633]" />
                <span>Certified lifeguards for facilities & events</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#FF6633]" />
                <span>Open-water coverage with experienced teams</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#FF6633]" />
                <span>On-site safety culture & public education</span>
              </li>
            </ul>
          </article>
        </div>
      </section>

      {/* Who we are */}
      <section className="px-4 pb-12">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl md:text-2xl font-semibold text-[#20334F] text-center">
              Who We Are
            </h2>
            <p className="mt-3 text-[#384152]">
              Started in 2017 by a team of three. Between them, they bring 43
              years of combined experience in lifesaving and swim teaching. In a
              short span, we’ve provided lifeguard services — short and long
              term — to clubs, hotels, schools, parties, beach events, and open
              water competitions.
            </p>
          </div>
        </div>
      </section>

      {/* Clients logo grid (uses /public/clients) */}
      <section className="px-4 pb-20">
        <div className="mx-auto max-w-7xl">
          <h3 className="text-center text-xl md:text-2xl font-semibold text-[#20334F]">
            Our Clients
          </h3>
          <ul className="mt-6 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 items-center">
            {logos.map((src, i) => (
              <li
                key={i}
                className="flex items-center justify-center rounded-xl border border-gray-200 bg-white p-4"
              >
                <Image
                  src={src}
                  alt="client logo"
                  width={120}
                  height={60}
                  className="h-10 w-auto object-contain grayscale hover:grayscale-0 transition"
                />
              </li>
            ))}
          </ul>
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
