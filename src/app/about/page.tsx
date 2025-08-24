// app/about/page.tsx
import { logos } from "@/content/Content";
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - Bearded Lifeguard",
  description:
    "Learn about Bearded Lifeguard, Singapore's trusted water safety experts since 2017. 43 years of combined experience in lifesaving and swim teaching. Reducing drowning deaths through education and professional lifeguard services.",
  keywords: [
    "about bearded lifeguard",
    "singapore lifeguard company",
    "water safety experts",
    "lifeguard experience",
    "drowning prevention singapore",
    "swimming safety education",
    "professional lifeguard team",
    "water safety mission",
    "lifeguard training singapore",
  ],
  authors: [{ name: "Bearded Lifeguard" }],
  metadataBase: new URL("https://sglifeguardservices.com"),
  creator: "Bearded Lifeguard",
  publisher: "Bearded Lifeguard",
  openGraph: {
    type: "website",
    locale: "en_SG",
    url: "https://sglifeguardservices.com/about",
    title: "About Us - Bearded Lifeguard",
    description:
      "Singapore's trusted water safety experts since 2017. 43 years of combined experience in lifesaving and swim teaching.",
    siteName: "Bearded Lifeguard",
  },
  alternates: {
    canonical: "https://sglifeguardservices.com/about",
  },
};

export default function AboutUs() {
  return (
    <main className="page-container">
      {/* Intro */}
      <section className="page-content">
        <div className="content-wrapper">
          <div className="modern-hero">
            <span className="inline-flex items-center rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-[#FF6633] border border-orange-200">
              ABOUT US
            </span>

            <h1 className="mt-6 text-3xl md:text-5xl font-bold text-modern-primary">
              Bearded Lifeguard
            </h1>

            <p className="mt-6 max-w-3xl text-modern-secondary text-lg">
              Drowning is the 3<sup>rd</sup> leading cause of unintentional
              injury death worldwide (WHO, 2018). There are an estimated 360,000
              annual drowning deaths. Children, males, and individuals are most
              at risk.
            </p>

            <p className="mt-4 font-bold text-modern-primary text-xl">
              OUR MISSION — To reduce this number.
            </p>

            <p className="mt-4 max-w-3xl text-modern-secondary text-lg">
              It's not enough if it were only us doing it. Our approach is to
              educate the public through swimming lessons, conduct water safety
              talks, and provide professionally trained lifeguards to designated
              pools.
            </p>
          </div>
        </div>
      </section>

      {/* Approach: Education & Awareness */}
      <section className="page-content">
        <div className="content-wrapper grid grid-cols-1 md:grid-cols-2 gap-8">
          <article className="modern-card-hover p-8">
            <h2 className="text-xl md:text-2xl font-semibold text-modern-primary">
              Education
            </h2>
            <p className="mt-4 text-modern-secondary">
              Swimming lessons, water safety talks, lifesaving courses.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-modern-light">
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-[#FF6633]" />
                <span>Learn-to-swim & fundamentals</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-[#FF6633]" />
                <span>Water safety talks for schools & organizations</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-[#FF6633]" />
                <span>Lifesaving courses & CPR training</span>
              </li>
            </ul>
          </article>

          <article className="modern-card-hover p-8">
            <h2 className="text-xl md:text-2xl font-semibold text-modern-primary">
              Awareness
            </h2>
            <p className="mt-4 text-modern-secondary">
              Lifeguard services across pools, beaches, events & parties. With
              presence, comes awareness.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-modern-light">
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-[#FF6633]" />
                <span>Certified lifeguards for facilities & events</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-[#FF6633]" />
                <span>Open-water coverage with experienced teams</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-[#FF6633]" />
                <span>On-site safety culture & public education</span>
              </li>
            </ul>
          </article>
        </div>
      </section>

      {/* Who we are */}
      <section className="page-content">
        <div className="content-wrapper">
          <div className="modern-section-accent p-8 text-center">
            <h2 className="text-xl md:text-2xl font-semibold text-modern-primary">
              Who We Are
            </h2>
            <p className="mt-4 text-modern-secondary text-lg leading-relaxed">
              Started in 2017 by a team of three. Between them, they bring 43
              years of combined experience in lifesaving and swim teaching. In a
              short span, we've provided lifeguard services — short and long
              term — to clubs, hotels, schools, parties, beach events, and open
              water competitions.
            </p>
          </div>
        </div>
      </section>

      {/* Clients logo grid (uses /public/clients) */}
      <section className="page-content">
        <div className="content-wrapper">
          <h3 className="text-center text-xl md:text-2xl font-semibold text-modern-primary mb-8">
            Our Clients
          </h3>
          <ul className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6 items-center">
            {logos.map((src, i) => (
              <li
                key={i}
                className="modern-card-hover flex items-center justify-center p-4"
              >
                <Image
                  src={src}
                  alt="client logo"
                  width={120}
                  height={60}
                  className="h-10 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity duration-300"
                />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
