import Image from "next/image";
import Link from "next/link";
import { CheckCircle, Waves, Shield, MapPin, Users, Clock, ArrowRight, Star, AlertTriangle } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Open Water Lifeguards - Bearded Lifeguard",
  description: "Expert open water lifeguard services in Singapore for beaches, reservoirs, sporting events and film productions. Specialized open water safety management with professional rescue equipment and certified Safety Managers.",
  keywords: [
    "open water lifeguards singapore",
    "beach lifeguards singapore",
    "reservoir lifeguards",
    "open water safety singapore",
    "triathlon lifeguards",
    "swimming competition safety",
    "film production lifeguards",
    "marine safety specialists",
    "open water rescue teams",
    "coastal event safety"
  ],
  authors: [{ name: "Bearded Lifeguard" }],
  creator: "Bearded Lifeguard",
  publisher: "Bearded Lifeguard",
  openGraph: {
    type: "website",
    locale: "en_SG",
    url: "https://sglifeguardservices.com/services/open-water",
    title: "Open Water Lifeguards Singapore - Bearded Lifeguard",
    description: "Expert open water lifeguard services for beaches, reservoirs, sporting events and productions. Professional Safety Managers and rescue equipment for challenging aquatic environments.",
    siteName: "Bearded Lifeguard",
    images: [
      {
        url: "/og-image-open-water.jpg",
        width: 1200,
        height: 630,
        alt: "Open Water Lifeguards Singapore - Bearded Lifeguard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Open Water Lifeguards - Bearded Lifeguard",
    description: "Expert open water lifeguard services for beaches, reservoirs, and sporting events. Professional Safety Managers available now.",
    images: ["/og-image-open-water.jpg"],
  },
  alternates: {
    canonical: "https://sglifeguardservices.com/services/open-water",
  },
};

export default function OpenWaterPage() {
  return (
    <main className="bg-[#fafafa]">
      {/* Hero Section */}
      <section className="px-4 pt-16 md:pt-20 pb-12 bg-gradient-to-br from-blue-50 via-cyan-50 to-white">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-8">
            <span className="inline-flex items-center rounded-full bg-[#FFEDD5] px-4 py-2 text-sm font-semibold text-[#FF6633]">
              OPEN WATER SERVICES
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-[#20334F] text-center mb-6">
            Expert Open Water <br/>
            <span className="text-[#FF6633]">Lifeguard Services</span>
          </h1>

          <p className="text-xl text-[#384152] text-center max-w-3xl mx-auto mb-8">
            Singapore's premier open water safety specialists. From beaches and reservoirs 
            to sporting events and film productions, our certified open water lifeguards 
            provide unmatched expertise in challenging aquatic environments.
          </p>

          <div className="text-center">
            <Link 
              href="/booking"
              className="inline-flex items-center gap-2 bg-[#FF6633] text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#e55a2b] transition-colors"
            >
              <Waves className="w-5 h-5" />
              Book Open Water Lifeguards
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Expertise Highlights */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#20334F] mb-4">
              Why Choose Our Open Water Specialists?
            </h2>
            <p className="text-lg text-[#384152] max-w-2xl mx-auto">
              Open water environments present unique challenges requiring specialized training, 
              equipment, and experience. Our team delivers uncompromising safety standards.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Waves className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#20334F] mb-2">Open Water Certified</h3>
              <p className="text-[#384152]">Specialized open water lifeguard certifications with advanced rescue training.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#20334F] mb-2">Safety Management</h3>
              <p className="text-[#384152]">Dedicated Safety Managers oversee complex operations with comprehensive risk assessment.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#20334F] mb-2">Local Expertise</h3>
              <p className="text-[#384152]">Deep knowledge of Singapore's waters, currents, weather patterns, and regulations.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#20334F] mb-2">Team Operations</h3>
              <p className="text-[#384152]">Coordinated multi-lifeguard teams with rescue craft and communication systems.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Open Water Locations */}
      <section className="px-4 py-16 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#20334F] mb-4">
              Open Water Locations We Cover
            </h2>
            <p className="text-lg text-[#384152] max-w-2xl mx-auto">
              From Singapore's pristine beaches to challenging reservoir environments, 
              we provide safety coverage across diverse open water locations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-100">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                <Waves className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#20334F] mb-3">Beaches & Coastlines</h3>
              <ul className="space-y-2 text-[#384152] text-sm mb-4">
                <li>• Sentosa beaches</li>
                <li>• East Coast Park</li>
                <li>• Changi Beach</li>
                <li>• Private beach resorts</li>
                <li>• Coastal event venues</li>
              </ul>
              <div className="bg-blue-100 rounded-lg p-3 text-xs text-blue-800">
                <strong>Expertise:</strong> Tide awareness, beach patrol techniques, 
                surf conditions, and crowd management.
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-8 border border-green-100">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#20334F] mb-3">Reservoirs & Lakes</h3>
              <ul className="space-y-2 text-[#384152] text-sm mb-4">
                <li>• MacRitchie Reservoir</li>
                <li>• Bedok Reservoir</li>
                <li>• Jurong Lake</li>
                <li>• Lower Seletar Reservoir</li>
                <li>• Private water bodies</li>
              </ul>
              <div className="bg-green-100 rounded-lg p-3 text-xs text-green-800">
                <strong>Expertise:</strong> Freshwater rescue techniques, varied depths, 
                limited visibility, and access challenges.
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 border border-orange-100">
              <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#20334F] mb-3">Challenging Environments</h3>
              <ul className="space-y-2 text-[#384152] text-sm mb-4">
                <li>• Strong current areas</li>
                <li>• Deep water locations</li>
                <li>• Remote access points</li>
                <li>• Weather-dependent venues</li>
                <li>• Multi-zone water bodies</li>
              </ul>
              <div className="bg-orange-100 rounded-lg p-3 text-xs text-orange-800">
                <strong>Expertise:</strong> Advanced rescue techniques, specialized equipment, 
                and comprehensive emergency planning.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Event Types */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#20334F] mb-4">
              Open Water Events We Support
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <h3 className="text-2xl font-bold text-[#20334F] mb-6">Sporting Events</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-[#20334F] mb-2">Swimming Competitions</h4>
                  <p className="text-sm text-[#384152]">Open water swimming races, marathons, and triathlon swim legs with comprehensive safety coverage.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-[#20334F] mb-2">Water Sports</h4>
                  <p className="text-sm text-[#384152]">Kayaking, sailing, dragon boat racing, and other water sports competitions requiring safety oversight.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-[#20334F] mb-2">Training Camps</h4>
                  <p className="text-sm text-[#384152]">Athletic training sessions, swim squads, and specialized water sports training programs.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <h3 className="text-2xl font-bold text-[#20334F] mb-6">Commercial Productions</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-[#20334F] mb-2">Film & Television</h4>
                  <p className="text-sm text-[#384152]">Movie shoots, TV productions, documentaries, and commercial filming requiring water safety expertise.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-[#20334F] mb-2">Photography</h4>
                  <p className="text-sm text-[#384152]">Fashion shoots, product photography, and artistic projects in challenging open water environments.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-[#20334F] mb-2">Marketing Content</h4>
                  <p className="text-sm text-[#384152]">Brand campaigns, promotional videos, and social media content requiring safety supervision.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="px-4 py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#20334F] mb-6">
                Our Open Water Safety Approach
              </h2>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#20334F] mb-2">Site Assessment & Planning</h3>
                    <p className="text-[#384152]">Comprehensive evaluation of water conditions, access points, potential hazards, and emergency evacuation routes.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#20334F] mb-2">Equipment & Team Deployment</h3>
                    <p className="text-[#384152]">Strategic positioning of rescue craft, safety equipment, and communication systems with trained personnel.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#20334F] mb-2">Continuous Monitoring</h3>
                    <p className="text-[#384152]">Active surveillance of all water activities with immediate response capability and coordination with emergency services.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-sm">4</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#20334F] mb-2">End-to-End Safety Management</h3>
                    <p className="text-[#384152]">Complete operational oversight from pre-event briefing through post-event debriefing and reporting.</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-blue-50 rounded-xl p-6">
                <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Safety Manager On-Site
                </h4>
                <p className="text-blue-700 text-sm">
                  Every open water operation includes a dedicated Safety Manager who coordinates 
                  all aspects of water safety, ensuring seamless communication and rapid response.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
                <Image
                  src="/services1.jpg"
                  alt="Professional open water lifeguards with rescue equipment"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg">
                <div className="text-sm font-semibold">500+ Events</div>
                <div className="text-xs">Safely Managed</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Equipment & Capabilities */}
      <section className="px-4 py-16 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#20334F] mb-4">
              Professional Equipment & Capabilities
            </h2>
            <p className="text-lg text-[#384152] max-w-2xl mx-auto">
              We provide comprehensive safety equipment and trained personnel 
              for the most demanding open water environments.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gray-50 rounded-2xl">
              <h3 className="text-lg font-bold text-[#20334F] mb-4">Rescue Craft</h3>
              <ul className="text-sm text-[#384152] space-y-2">
                <li>• Jet skis with rescue sleds</li>
                <li>• Inflatable rescue boats</li>
                <li>• Rescue boards</li>
                <li>• Emergency watercraft</li>
              </ul>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-2xl">
              <h3 className="text-lg font-bold text-[#20334F] mb-4">Safety Equipment</h3>
              <ul className="text-sm text-[#384152] space-y-2">
                <li>• Marine first aid stations</li>
                <li>• Oxygen delivery systems</li>
                <li>• Rescue tubes & throws</li>
                <li>• Emergency signaling devices</li>
              </ul>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-2xl">
              <h3 className="text-lg font-bold text-[#20334F] mb-4">Communication</h3>
              <ul className="text-sm text-[#384152] space-y-2">
                <li>• Marine radio systems</li>
                <li>• Emergency communication</li>
                <li>• Weather monitoring</li>
                <li>• Coordination centers</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Success Story */}
      <section className="px-4 py-16 bg-blue-50">
        <div className="mx-auto max-w-4xl">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>
              <h3 className="text-2xl font-bold text-[#20334F] mb-4">
                International Triathlon Success
              </h3>
              <blockquote className="text-lg italic text-[#384152] leading-relaxed mb-4">
                "Bearded Lifeguard's open water team provided exceptional safety coverage 
                for our international triathlon at East Coast. Their Safety Manager coordinated 
                seamlessly with race officials, and their rescue craft operators were positioned 
                perfectly. Professional, reliable, and absolutely essential for our event success."
              </blockquote>
              <div>
                <div className="font-semibold text-[#20334F]">Marcus Lim</div>
                <div className="text-[#384152] text-sm">Race Director, Singapore International Triathlon</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking CTA */}
      <section className="px-4 py-16 bg-gradient-to-r from-blue-600 to-cyan-600">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready for Expert Open Water Safety?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Trust Singapore's open water specialists for your next challenging aquatic event. 
            Comprehensive planning, professional execution, absolute safety.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/booking"
              className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-colors"
            >
              <Waves className="w-5 h-5" />
              Book Open Water Experts
              <ArrowRight className="w-5 h-5" />
            </Link>
            
            <Link 
              href="/services"
              className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              View All Services
            </Link>
          </div>

          <div className="mt-8 text-white/80 text-sm">
            <p>• Dedicated Safety Managers • Professional rescue equipment • Comprehensive event planning</p>
          </div>
        </div>
      </section>
    </main>
  );
}