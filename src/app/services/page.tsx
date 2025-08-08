// app/lifeguard-services/page.tsx
import { Cta } from "@/components/Cta";
import Image from "next/image";

export default function LifeguardServicesPage() {
  return (
    <main className="bg-[#fafafa]">
      {/* Header */}
      <section className="pt-16 md:pt-20 pb-10 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6">
            <span className="inline-flex items-center rounded-full bg-[#FFEDD5] px-3 py-1 text-xs font-semibold text-[#FF6633]">
              SERVICES
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-[#20334F]">
            Lifeguard Services
          </h1>

          <p className="mt-4 max-w-3xl text-[#384152]">
            Hiring lifeguards can be a challenge; finding the rightfully
            certified guards and those who are professional at their job. Fret
            not! We have a huge database of lifesaving-certified lifeguards who
            are trained and have experience from pools to open waters, ready to
            be deployed to:
          </p>

          {/* Responsibilities */}
          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6">
            <ul className="space-y-3 text-[#384152]">
              <li className="flex items-start gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-[#FF6633]" />
                <span>
                  Maintain constant surveillance of patrons in the facility.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-[#FF6633]" />
                <span>
                  Act immediately and appropriately in emergencies to secure
                  swimmer safety.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-[#FF6633]" />
                <span>
                  Provide emergency care and treatment until emergency services
                  arrive.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Pool / Events / Parties */}
      <section className="px-4 pb-12">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-2xl md:text-3xl font-bold text-[#20334F]">
            Lifeguards for Pools, Events & Pool Parties
          </h2>

          {/* Images */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <Image
                src="/services1.jpg"
                alt="Lifeguard overseeing pool patrons"
                width={1024}
                height={512}
                className="h-auto w-full object-cover"
              />
            </div>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <Image
                src="/services2.jpg"
                alt="Professional lifeguards on duty by the pool"
                width={1024}
                height={512}
                className="h-auto w-full object-cover"
              />
            </div>
          </div>

          <p className="mt-6 text-[#384152]">
            The Bearded Lifeguard team is deployed on yearly contracts at
            several hotel pools and institutions in Singapore. We’re equipped
            for long-term coverage, and can also be hired ad-hoc for birthdays,
            company events, filming, or any waterway activity.
          </p>
        </div>
      </section>

      <hr className="mx-4 border-t border-gray-200" />

      {/* Open Water */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-2xl md:text-3xl font-bold text-[#20334F]">
            Open Water Lifeguard Services
          </h2>

          {/* Images */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <Image
                src="/services3.jpg"
                alt="Open water lifeguards during event safety operations"
                width={1024}
                height={768}
                className="h-auto w-full object-cover"
              />
            </div>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <Image
                src="/services4.jpg"
                alt="Rescue craft and lifeguards at open water venue"
                width={1024}
                height={800}
                className="h-auto w-full object-cover"
              />
            </div>
          </div>

          <p className="mt-6 text-[#384152]">
            Our lifeguards have supported numerous open water events. A
            dedicated Safety Manager oversees operations end-to-end so you can
            have peace of mind.
          </p>
        </div>
      </section>
    </main>
  );
}
