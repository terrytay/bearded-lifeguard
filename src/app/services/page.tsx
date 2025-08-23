// app/services/page.tsx
import Image from "next/image";
import Link from "next/link";
import { Cta } from "@/components/Cta";
import { ArrowRight } from "lucide-react";

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

      {/* Service Types */}
      <section className="px-4 pb-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-2xl md:text-3xl font-semibold text-[#20334F] mb-12">
            Our Lifeguard Services
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Pool Services */}
            <Link href="/services/pools" className="group">
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="relative">
                  <Image
                    src="/services4.jpg"
                    alt="Pool lifeguard services"
                    width={600}
                    height={300}
                    className="h-48 w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-2">Pool Lifeguarding</h3>
                    <p className="text-white/90 text-sm">Professional supervision for residential, commercial, and specialty pools</p>
                  </div>
                </div>
                <div className="p-6">
                  <ul className="space-y-2 text-sm text-[#384152] mb-4">
                    <li>• Residential & commercial pools</li>
                    <li>• Hotel & resort facilities</li>
                    <li>• Condominium complexes</li>
                    <li>• Private clubs & institutions</li>
                  </ul>
                  <div className="flex items-center justify-between">
                    <span className="text-[#FF6633] font-semibold">Learn More</span>
                    <ArrowRight className="w-4 h-4 text-[#FF6633] group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Event Services */}
            <Link href="/services/events" className="group">
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="relative">
                  <Image
                    src="/services3.jpg"
                    alt="Event lifeguard services"
                    width={600}
                    height={300}
                    className="h-48 w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-2">Event Lifeguarding</h3>
                    <p className="text-white/90 text-sm">Safety coverage for corporate events, community functions, and productions</p>
                  </div>
                </div>
                <div className="p-6">
                  <ul className="space-y-2 text-sm text-[#384152] mb-4">
                    <li>• Corporate team building events</li>
                    <li>• Community festivals & galas</li>
                    <li>• Film & TV productions</li>
                    <li>• Sports competitions</li>
                  </ul>
                  <div className="flex items-center justify-between">
                    <span className="text-[#FF6633] font-semibold">Learn More</span>
                    <ArrowRight className="w-4 h-4 text-[#FF6633] group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Pool Party Services */}
            <Link href="/services/pool-parties" className="group">
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="relative">
                  <Image
                    src="/services4.jpg"
                    alt="Pool party lifeguard services"
                    width={600}
                    height={300}
                    className="h-48 w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-2">Pool Party Lifeguarding</h3>
                    <p className="text-white/90 text-sm">Fun-friendly safety for birthdays, celebrations, and social gatherings</p>
                  </div>
                </div>
                <div className="p-6">
                  <ul className="space-y-2 text-sm text-[#384152] mb-4">
                    <li>• Birthday celebrations</li>
                    <li>• Family reunions</li>
                    <li>• Teen & adult parties</li>
                    <li>• Special occasion events</li>
                  </ul>
                  <div className="flex items-center justify-between">
                    <span className="text-[#FF6633] font-semibold">Learn More</span>
                    <ArrowRight className="w-4 h-4 text-[#FF6633] group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Open Water Services */}
            <Link href="/services/open-water" className="group">
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="relative">
                  <Image
                    src="/services1.jpg"
                    alt="Open water lifeguard services"
                    width={600}
                    height={300}
                    className="h-48 w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-2">Open Water Lifeguarding</h3>
                    <p className="text-white/90 text-sm">Specialized safety for beaches, reservoirs, and challenging environments</p>
                  </div>
                </div>
                <div className="p-6">
                  <ul className="space-y-2 text-sm text-[#384152] mb-4">
                    <li>• Beach & coastal events</li>
                    <li>• Reservoir activities</li>
                    <li>• Swimming competitions</li>
                    <li>• Film productions</li>
                  </ul>
                  <div className="flex items-center justify-between">
                    <span className="text-[#FF6633] font-semibold">Learn More</span>
                    <ArrowRight className="w-4 h-4 text-[#FF6633] group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          </div>

          <div className="text-center mt-12">
            <p className="text-lg text-[#384152] mb-8 max-w-3xl mx-auto">
              Whether you need pool supervision, event safety coverage, or open water expertise, 
              our certified lifeguards provide professional, reliable service tailored to your specific needs.
            </p>
            <Link 
              href="/booking"
              className="inline-flex items-center gap-2 bg-[#FF6633] text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#e55a2b] transition-colors"
            >
              Book Lifeguard Service
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
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
