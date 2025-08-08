// app/services/page.tsx
import Image from "next/image";

export default function LifeguardServicesPage() {
  return (
    <main className="bg-[#fafafa]">
      {/* Header */}
      <section className="px-4 pt-16 md:pt-20 pb-10">
        <div className="mx-auto max-w-7xl">
          <span className="inline-flex items-center rounded-full bg-[#FFEDD5] px-3 py-1 text-xs font-semibold text-[#FF6633]">
            SERVICES
          </span>

          <h1 className="mt-4 text-3xl md:text-5xl font-bold text-[#20334F]">
            Lifeguard Services
          </h1>

          <p className="mt-4 max-w-3xl text-[#384152]">
            Hiring lifeguards can be a challenge; finding the rightfully
            certified guards and those who are professional at their job. Fret
            not — our database of lifesaving-certified lifeguards is ready for
            deployment at pools and open waters.
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

      {/* Pools / Events / Parties */}
      <section className="px-4 pb-12">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-2xl md:text-3xl font-semibold text-[#20334F]">
            Lifeguards for Pools, Events & Pool Parties
          </h2>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <Image
                src="/services4.jpg"
                alt="Lifeguard overseeing pool patrons"
                width={1600}
                height={800}
                className="h-auto w-full object-cover"
                priority
              />
            </div>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <Image
                src="/services3.jpg"
                alt="Professional lifeguards on duty"
                width={1600}
                height={800}
                className="h-auto w-full object-cover"
              />
            </div>
          </div>

          <p className="mt-6 text-[#384152]">
            We’re engaged on yearly contracts at hotel pools and institutions
            across Singapore. We also support ad-hoc needs for birthdays,
            company events, filming, and waterways.
          </p>
        </div>
      </section>

      {/* Open Water */}
      <section className="px-4 pb-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-2xl md:text-3xl font-semibold text-[#20334F]">
            Open Water Lifeguard Services
          </h2>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <Image
                src="/services1.jpg"
                alt="Open water lifeguards during event"
                width={1600}
                height={1200}
                className="h-auto w-full object-cover"
              />
            </div>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <Image
                src="/services2.jpg"
                alt="Rescue craft and lifeguards at open water venue"
                width={1600}
                height={1200}
                className="h-auto w-full object-cover"
              />
            </div>
          </div>

          <p className="mt-6 text-[#384152]">
            Our teams have supported numerous open water events. A dedicated
            Safety Manager oversees operations end-to-end so you can have peace
            of mind.
          </p>
        </div>
      </section>
    </main>
  );
}
