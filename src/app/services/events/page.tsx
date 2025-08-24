import Image from "next/image";
import Link from "next/link";
import { CheckCircle, Calendar, Users, Shield, Star, ArrowRight, Clock } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Event Lifeguard Services - Bearded Lifeguard",
  description: "Professional event lifeguard services in Singapore for corporate events, community festivals, sports competitions, and film productions. Experienced event safety management and aquatic supervision.",
  keywords: [
    "event lifeguards singapore",
    "corporate event lifeguards",
    "festival lifeguards",
    "sports event lifeguards",
    "film production lifeguards",
    "community event safety",
    "aquatic event management",
    "event water safety",
    "singapore event lifeguards",
    "professional event supervision"
  ],
  authors: [{ name: "Bearded Lifeguard" }],
  creator: "Bearded Lifeguard",
  publisher: "Bearded Lifeguard",
  openGraph: {
    type: "website",
    locale: "en_SG",
    url: "https://sglifeguardservices.com/services/events",
    title: "Event Lifeguard Services Singapore - Bearded Lifeguard",
    description: "Professional event lifeguard services for corporate events, festivals, sports competitions, and productions. Expert aquatic safety management.",
    siteName: "Bearded Lifeguard",
    images: [
      {
        url: "/og-image-events.jpg",
        width: 1200,
        height: 630,
        alt: "Event Lifeguard Services Singapore - Bearded Lifeguard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Event Lifeguard Services - Bearded Lifeguard",
    description: "Professional event lifeguard services for corporate events, festivals, and competitions. Expert water safety management.",
    images: ["/og-image-events.jpg"],
  },
  alternates: {
    canonical: "https://sglifeguardservices.com/services/events",
  },
};

export default function EventsPage() {
  return (
    <main className="bg-[#fafafa]">
      {/* Hero Section */}
      <section className="px-4 pt-16 md:pt-20 pb-12 bg-gradient-to-br from-blue-50 to-white">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-8">
            <span className="inline-flex items-center rounded-full bg-[#FFEDD5] px-4 py-2 text-sm font-semibold text-[#FF6633]">
              EVENT SERVICES
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-[#20334F] text-center mb-6">
            Professional Event <br/>
            <span className="text-[#FF6633]">Lifeguard Services</span>
          </h1>

          <p className="text-xl text-[#384152] text-center max-w-3xl mx-auto mb-8">
            Make your aquatic events safe and successful with our experienced lifeguards. 
            From corporate gatherings to community festivals, we ensure water safety 
            so you can focus on creating memorable experiences.
          </p>

          <div className="text-center">
            <Link 
              href="/booking"
              className="inline-flex items-center gap-2 bg-[#FF6633] text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#e55a2b] transition-colors"
            >
              Book Event Lifeguards
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Event Types */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#20334F] mb-4">
              Events We Support
            </h2>
            <p className="text-lg text-[#384152] max-w-2xl mx-auto">
              Our lifeguards have extensive experience providing safety coverage 
              for all types of aquatic events across Singapore.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-[#20334F] mb-3">Corporate Events</h3>
              <ul className="space-y-2 text-[#384152] text-sm">
                <li>• Company team building activities</li>
                <li>• Corporate pool parties</li>
                <li>• Client entertainment events</li>
                <li>• Staff appreciation days</li>
                <li>• Product launch pool events</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-[#20334F] mb-3">Community Events</h3>
              <ul className="space-y-2 text-[#384152] text-sm">
                <li>• Neighborhood festivals</li>
                <li>• School swimming galas</li>
                <li>• Charity fundraising events</li>
                <li>• Community center activities</li>
                <li>• Housing estate celebrations</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-[#20334F] mb-3">Private Functions</h3>
              <ul className="space-y-2 text-[#384152] text-sm">
                <li>• Wedding pool receptions</li>
                <li>• Anniversary celebrations</li>
                <li>• Family reunions</li>
                <li>• Milestone birthday parties</li>
                <li>• Graduation celebrations</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-[#20334F] mb-3">Sports Events</h3>
              <ul className="space-y-2 text-[#384152] text-sm">
                <li>• Swimming competitions</li>
                <li>• Water polo matches</li>
                <li>• Triathlon events</li>
                <li>• Aqua fitness classes</li>
                <li>• Swimming training camps</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-[#20334F] mb-3">Film & Media</h3>
              <ul className="space-y-2 text-[#384152] text-sm">
                <li>• Commercial video shoots</li>
                <li>• Movie filming</li>
                <li>• Photography sessions</li>
                <li>• Television productions</li>
                <li>• Advertising campaigns</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-[#20334F] mb-3">Educational Events</h3>
              <ul className="space-y-2 text-[#384152] text-sm">
                <li>• Swimming lessons</li>
                <li>• Water safety workshops</li>
                <li>• Lifeguard training sessions</li>
                <li>• School field trips</li>
                <li>• Youth camp activities</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Service Features */}
      <section className="px-4 py-16 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#20334F] mb-4">
              What Makes Our Event Service Special
            </h2>
            <p className="text-lg text-[#384152] max-w-2xl mx-auto">
              We go beyond basic lifeguarding to provide comprehensive event support 
              that ensures your aquatic event runs smoothly from start to finish.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#FF6633] rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#20334F] mb-2">Event Planning Support</h3>
              <p className="text-[#384152]">Pre-event consultation to assess safety requirements and develop risk management plans.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#FF6633] rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#20334F] mb-2">Scalable Coverage</h3>
              <p className="text-[#384152]">From single lifeguards to full safety teams, we scale our service to match your event size.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#FF6633] rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#20334F] mb-2">Safety Equipment</h3>
              <p className="text-[#384152]">Full safety equipment provided including rescue boards, first aid stations, and communication devices.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#FF6633] rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#20334F] mb-2">Flexible Timing</h3>
              <p className="text-[#384152]">Available for early morning setups, late evening events, and multi-day functions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#20334F] mb-6">
                How Our Event Service Works
              </h2>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-[#FF6633] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#20334F] mb-2">Initial Consultation</h3>
                    <p className="text-[#384152]">We discuss your event details, venue requirements, expected attendance, and specific safety needs.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-[#FF6633] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#20334F] mb-2">Site Assessment</h3>
                    <p className="text-[#384152]">If needed, we conduct a pre-event site visit to understand the venue layout and identify potential risks.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-[#FF6633] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#20334F] mb-2">Safety Plan Development</h3>
                    <p className="text-[#384152]">We create a comprehensive safety plan including lifeguard positioning and emergency procedures.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-[#FF6633] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-sm">4</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#20334F] mb-2">Event Execution</h3>
                    <p className="text-[#384152]">Our certified lifeguards arrive early, set up equipment, and provide continuous safety coverage throughout your event.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
                <Image
                  src="/services3.jpg"
                  alt="Professional lifeguards at corporate event"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="px-4 py-16 bg-gray-50">
        <div className="mx-auto max-w-4xl text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="mb-6">
              <div className="flex justify-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>
              <blockquote className="text-xl italic text-[#384152] leading-relaxed">
                "Bearded Lifeguard made our corporate pool party absolutely stress-free. 
                Their lifeguards were professional, vigilant, and helped create a safe 
                environment where our employees could truly enjoy themselves. Highly recommended!"
              </blockquote>
            </div>
            <div>
              <div className="font-semibold text-[#20334F]">Sarah Chen</div>
              <div className="text-[#384152] text-sm">HR Director, TechCorp Singapore</div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking CTA */}
      <section className="px-4 py-16 bg-gradient-to-r from-[#FF6633] to-[#e55a2b]">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Make Your Event Safe & Successful?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Let us handle the water safety while you focus on creating an amazing event experience. 
            Book now for competitive rates and professional service.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/booking"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#FF6633] px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-colors"
            >
              Book Event Lifeguards
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
            <p>• Free consultation included • Same-day availability • Comprehensive insurance coverage</p>
          </div>
        </div>
      </section>
    </main>
  );
}