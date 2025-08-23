import Image from "next/image";
import Link from "next/link";
import { CheckCircle, PartyPopper, Users, Heart, Clock, ArrowRight, Star, Shield } from "lucide-react";

export default function PoolPartiesPage() {
  return (
    <main className="bg-[#fafafa]">
      {/* Hero Section */}
      <section className="px-4 pt-16 md:pt-20 pb-12 bg-gradient-to-br from-pink-50 via-orange-50 to-white">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-8">
            <span className="inline-flex items-center rounded-full bg-[#FFEDD5] px-4 py-2 text-sm font-semibold text-[#FF6633]">
              POOL PARTY SERVICES
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-[#20334F] text-center mb-6">
            Safe & Fun <br/>
            <span className="text-[#FF6633]">Pool Party</span> Lifeguards
          </h1>

          <p className="text-xl text-[#384152] text-center max-w-3xl mx-auto mb-8">
            Make your pool party unforgettable for all the right reasons. Our certified 
            lifeguards ensure everyone stays safe while having the time of their lives. 
            From intimate gatherings to large celebrations, we've got you covered.
          </p>

          <div className="text-center">
            <Link 
              href="/booking"
              className="inline-flex items-center gap-2 bg-[#FF6633] text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#e55a2b] transition-colors"
            >
              <PartyPopper className="w-5 h-5" />
              Book Pool Party Lifeguards
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us for Pool Parties */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#20334F] mb-4">
              Why Pool Party Hosts Love Us
            </h2>
            <p className="text-lg text-[#384152] max-w-2xl mx-auto">
              We understand that pool parties should be about fun, laughter, and creating memories. 
              Our lifeguards blend seamlessly into your celebration while keeping everyone safe.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold text-[#20334F] mb-2">Party-Friendly</h3>
              <p className="text-[#384152]">Our lifeguards are trained to maintain safety without dampening the party spirit.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-[#20334F] mb-2">Guest Experience</h3>
              <p className="text-[#384152]">Friendly, professional staff who enhance rather than restrict your party atmosphere.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-[#20334F] mb-2">Discreet Safety</h3>
              <p className="text-[#384152]">Vigilant protection that doesn't interfere with photos, games, or socializing.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-[#20334F] mb-2">Flexible Hours</h3>
              <p className="text-[#384152]">From daytime pool parties to evening celebrations, we match your schedule.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Party Types */}
      <section className="px-4 py-16 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#20334F] mb-4">
              Pool Parties We Cover
            </h2>
            <p className="text-lg text-[#384152] max-w-2xl mx-auto">
              Every celebration is unique, and we tailor our lifeguarding service 
              to match the vibe and safety needs of your specific party type.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-pink-50 to-white rounded-2xl p-8 border border-gray-100">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold text-[#20334F] mb-3">Birthday Celebrations</h3>
              <ul className="space-y-2 text-[#384152] text-sm mb-4">
                <li>• Kids' birthday pool parties</li>
                <li>• Adult milestone birthdays</li>
                <li>• Sweet 16 celebrations</li>
                <li>• Surprise pool parties</li>
              </ul>
              <p className="text-xs text-[#384152] bg-pink-50 rounded-lg p-3">
                <strong>Special touch:</strong> We work around cake cutting, gift opening, 
                and party games while maintaining safety.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-[#20334F] mb-3">Social Gatherings</h3>
              <ul className="space-y-2 text-[#384152] text-sm mb-4">
                <li>• House warming pool parties</li>
                <li>• Friends reunion gatherings</li>
                <li>• Holiday celebrations</li>
                <li>• Weekend social events</li>
              </ul>
              <p className="text-xs text-[#384152] bg-blue-50 rounded-lg p-3">
                <strong>Special touch:</strong> Blend in naturally with your guests 
                while providing professional water safety oversight.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-8 border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <PartyPopper className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-[#20334F] mb-3">Special Occasions</h3>
              <ul className="space-y-2 text-[#384152] text-sm mb-4">
                <li>• Graduation pool parties</li>
                <li>• Engagement celebrations</li>
                <li>• Anniversary parties</li>
                <li>• Achievement celebrations</li>
              </ul>
              <p className="text-xs text-[#384152] bg-purple-50 rounded-lg p-3">
                <strong>Special touch:</strong> Respect the significance of your milestone 
                while ensuring a safe, memorable celebration.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-8 border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-[#20334F] mb-3">Family Reunions</h3>
              <ul className="space-y-2 text-[#384152] text-sm mb-4">
                <li>• Multi-generational gatherings</li>
                <li>• Extended family parties</li>
                <li>• Cousin meet-ups</li>
                <li>• Family vacation celebrations</li>
              </ul>
              <p className="text-xs text-[#384152] bg-green-50 rounded-lg p-3">
                <strong>Special touch:</strong> Extra vigilant with mixed age groups, 
                ensuring safety for everyone from toddlers to grandparents.
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-white rounded-2xl p-8 border border-gray-100">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-[#20334F] mb-3">Teen Parties</h3>
              <ul className="space-y-2 text-[#384152] text-sm mb-4">
                <li>• High school pool parties</li>
                <li>• Pre-prom celebrations</li>
                <li>• Summer break parties</li>
                <li>• Teen social gatherings</li>
              </ul>
              <p className="text-xs text-[#384152] bg-orange-50 rounded-lg p-3">
                <strong>Special touch:</strong> Cool, approachable lifeguards who teens 
                respect while maintaining necessary safety standards.
              </p>
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-white rounded-2xl p-8 border border-gray-100">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-[#20334F] mb-3">Themed Parties</h3>
              <ul className="space-y-2 text-[#384152] text-sm mb-4">
                <li>• Pool costume parties</li>
                <li>• Tropical themed events</li>
                <li>• Pool movie nights</li>
                <li>• Seasonal celebrations</li>
              </ul>
              <p className="text-xs text-[#384152] bg-teal-50 rounded-lg p-3">
                <strong>Special touch:</strong> We adapt to your theme while maintaining 
                professional safety standards and visibility.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Safety with Fun */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
                <Image
                  src="/services4.jpg"
                  alt="Lifeguard monitoring pool party safely"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-[#FF6633] text-white px-6 py-3 rounded-xl shadow-lg">
                <div className="text-sm font-semibold">Zero Accidents</div>
                <div className="text-xs">in 500+ pool parties</div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#20334F] mb-6">
                How We Keep Pool Parties Safe & Fun
              </h2>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-[#FF6633] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#20334F] mb-2">Pre-Party Briefing</h3>
                    <p className="text-[#384152]">We discuss your party plan, identify potential risks, and position ourselves strategically without being intrusive.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-[#FF6633] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#20334F] mb-2">Invisible Vigilance</h3>
                    <p className="text-[#384152]">Constant water monitoring while blending into the party atmosphere - guests often forget we're working!</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-[#FF6633] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#20334F] mb-2">Gentle Rule Enforcement</h3>
                    <p className="text-[#384152]">Friendly reminders about pool safety without being the "party police" - keeping everyone safe and happy.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-[#FF6633] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-sm">4</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#20334F] mb-2">Emergency Ready</h3>
                    <p className="text-[#384152]">Fully equipped for any situation while hoping we never need to use our emergency training.</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-green-50 rounded-xl p-6">
                <h4 className="font-semibold text-green-800 mb-2">🎉 Pool Party Promise</h4>
                <p className="text-green-700 text-sm">
                  We guarantee your guests will have an amazing time while staying completely safe. 
                  Our lifeguards are trained to enhance, not restrict, your party experience!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-4 py-16 bg-gray-50">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#20334F] mb-4">
              Happy Pool Party Hosts
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex justify-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <blockquote className="text-lg italic text-[#384152] leading-relaxed mb-4">
                "The lifeguard was fantastic at my daughter's 10th birthday pool party! 
                The kids loved playing water games while I could actually relax knowing 
                everyone was safe. Best investment ever!"
              </blockquote>
              <div className="text-center">
                <div className="font-semibold text-[#20334F]">Michelle Tan</div>
                <div className="text-[#384152] text-sm">Mother of Birthday Girl</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex justify-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <blockquote className="text-lg italic text-[#384152] leading-relaxed mb-4">
                "Our house warming pool party was perfect! The lifeguard was so professional 
                yet friendly - all our guests commented on how great they were. Will definitely 
                book again for our next celebration!"
              </blockquote>
              <div className="text-center">
                <div className="font-semibold text-[#20334F]">David & Lisa Wong</div>
                <div className="text-[#384152] text-sm">New Homeowners</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking CTA */}
      <section className="px-4 py-16 bg-gradient-to-r from-[#FF6633] to-[#e55a2b]">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready for a Safe & Spectacular Pool Party?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Let us handle the safety so you can focus on being the perfect host. 
            Your guests will have a blast, and you'll have complete peace of mind!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/booking"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#FF6633] px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-colors"
            >
              <PartyPopper className="w-5 h-5" />
              Book Pool Party Lifeguards
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
            <p>• Party-friendly lifeguards • Last-minute bookings available • Fun guaranteed, safety assured</p>
          </div>
        </div>
      </section>
    </main>
  );
}