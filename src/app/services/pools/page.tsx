import Image from "next/image";
import Link from "next/link";
import { CheckCircle, Shield, Clock, Users, Star, ArrowRight } from "lucide-react";

export default function PoolsPage() {
  return (
    <main className="bg-[#fafafa]">
      {/* Hero Section */}
      <section className="px-4 pt-16 md:pt-20 pb-12 bg-gradient-to-br from-blue-50 to-white">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-8">
            <span className="inline-flex items-center rounded-full bg-[#FFEDD5] px-4 py-2 text-sm font-semibold text-[#FF6633]">
              POOL SERVICES
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-[#20334F] text-center mb-6">
            Professional Pool <br/>
            <span className="text-[#FF6633]">Lifeguard Services</span>
          </h1>

          <p className="text-xl text-[#384152] text-center max-w-3xl mx-auto mb-8">
            Ensure the safety of your pool facility with our certified lifeguards. 
            From residential pools to commercial aquatic centers, we provide reliable 
            and professional water safety supervision.
          </p>

          <div className="text-center">
            <Link 
              href="/booking"
              className="inline-flex items-center gap-2 bg-[#FF6633] text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#e55a2b] transition-colors"
            >
              Book Pool Lifeguards
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#20334F] mb-4">
              Why Choose Our Pool Lifeguards?
            </h2>
            <p className="text-lg text-[#384152] max-w-2xl mx-auto">
              Our pool lifeguards are trained to the highest standards and equipped 
              with the skills to handle any aquatic emergency.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#FF6633] rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#20334F] mb-2">Certified Professionals</h3>
              <p className="text-[#384152]">All lifeguards hold current CPR, First Aid, and Pool Lifeguard certifications.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#FF6633] rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#20334F] mb-2">Flexible Scheduling</h3>
              <p className="text-[#384152]">Available for hourly, daily, or long-term contracts to fit your needs.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#FF6633] rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#20334F] mb-2">Team Coverage</h3>
              <p className="text-[#384152]">Multiple lifeguards available for large facilities and high-capacity pools.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#FF6633] rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#20334F] mb-2">Proven Experience</h3>
              <p className="text-[#384152]">Years of experience protecting swimmers at pools across Singapore.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Types */}
      <section className="px-4 py-16 bg-white">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl md:text-4xl font-bold text-[#20334F] text-center mb-12">
            Pool Types We Cover
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 border border-gray-100">
              <h3 className="text-2xl font-bold text-[#20334F] mb-4">Residential Pools</h3>
              <ul className="space-y-3 text-[#384152] mb-6">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#FF6633] mt-0.5 flex-shrink-0" />
                  <span>Private home pools</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#FF6633] mt-0.5 flex-shrink-0" />
                  <span>Condominium facilities</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#FF6633] mt-0.5 flex-shrink-0" />
                  <span>HDB swimming pools</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#FF6633] mt-0.5 flex-shrink-0" />
                  <span>Private club pools</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-white rounded-2xl p-8 border border-gray-100">
              <h3 className="text-2xl font-bold text-[#20334F] mb-4">Commercial Pools</h3>
              <ul className="space-y-3 text-[#384152] mb-6">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#FF6633] mt-0.5 flex-shrink-0" />
                  <span>Hotel swimming pools</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#FF6633] mt-0.5 flex-shrink-0" />
                  <span>Resort aquatic facilities</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#FF6633] mt-0.5 flex-shrink-0" />
                  <span>Fitness center pools</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#FF6633] mt-0.5 flex-shrink-0" />
                  <span>Public swimming complexes</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-8 border border-gray-100">
              <h3 className="text-2xl font-bold text-[#20334F] mb-4">Specialty Pools</h3>
              <ul className="space-y-3 text-[#384152] mb-6">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#FF6633] mt-0.5 flex-shrink-0" />
                  <span>School swimming pools</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#FF6633] mt-0.5 flex-shrink-0" />
                  <span>Therapy pools</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#FF6633] mt-0.5 flex-shrink-0" />
                  <span>Competition pools</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#FF6633] mt-0.5 flex-shrink-0" />
                  <span>Water parks</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Responsibilities */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#20334F] mb-6">
                Our Pool Lifeguard Responsibilities
              </h2>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-[#FF6633] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#20334F] mb-2">Continuous Pool Surveillance</h3>
                    <p className="text-[#384152]">Maintain constant visual contact with all swimmers and pool areas, ensuring immediate response capability.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-[#FF6633] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#20334F] mb-2">Emergency Response</h3>
                    <p className="text-[#384152]">Immediate water rescue and emergency medical care until professional medical services arrive.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-[#FF6633] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#20334F] mb-2">Safety Rule Enforcement</h3>
                    <p className="text-[#384152]">Enforce pool rules and regulations to prevent accidents and maintain a safe swimming environment.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-[#FF6633] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-sm">4</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#20334F] mb-2">Equipment Management</h3>
                    <p className="text-[#384152]">Maintain and operate safety equipment including rescue tubes, first aid kits, and communication devices.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
                <Image
                  src="/services4.jpg"
                  alt="Professional lifeguard monitoring pool safety"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing & Booking CTA */}
      <section className="px-4 py-16 bg-gradient-to-r from-[#FF6633] to-[#e55a2b]">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Secure Your Pool?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Get instant quotes and book certified pool lifeguards for your facility. 
            Flexible scheduling and competitive rates available.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/booking"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#FF6633] px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-colors"
            >
              Book Pool Lifeguards Now
              <ArrowRight className="w-5 h-5" />
            </Link>
            
            <Link 
              href="/services"
              className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-[#FF6633] transition-colors"
            >
              View All Services
            </Link>
          </div>

          <div className="mt-8 text-white/80 text-sm">
            <p>• Hourly rates from $21/hour • Same-day availability • Professional certified lifeguards</p>
          </div>
        </div>
      </section>
    </main>
  );
}