import { HeroList } from "@/content/Content";
import Image from "next/image";
import ClientCarousel from "./ImageSlider";
import { BookNowButton } from "./BookNow";

export function Hero() {
  return (
    <section className="flex flex-col w-full gap-10">
      {/* Headline */}
      <div className="flex flex-col items-center text-center gap-6">
        <h1 className="whitespace-nowrap text-2xl sm:text-3xl md:text-5xl leading-tight font-bold text-modern-primary">
          Your Safety, Our Priority
        </h1>
        <p className="max-w-2xl text-modern-secondary pb-2 text-lg">
          Your first line of defense in water safety — services, courses &
          certified lifeguards.
        </p>
        <BookNowButton variant="hero" size="lg" />
      </div>

      {/* Partners */}
      <div className="flex flex-col items-center pt-6">
        {/* <div className="flex items-end gap-3">
          <Image
            src="/ui/arrow-curve.svg"
            alt=""
            width={40}
            height={40}
            className="h-6 w-6 md:h-8 md:w-8 opacity-60 rotate-123"
          />
          <span className="pb-1 text-xs text-gray-500 italic">Trusted by</span>
        </div> */}
        <ClientCarousel />
      </div>

      {/* Feature cards */}
      <div className="feature-grid">
        {HeroList.map((item) => (
          <div key={item.name} className="modern-card-hover p-6 text-center">
            {/* icon */}
            <div className="modern-icon-container mx-auto">
              <Image
                src={item.image}
                alt={item.name}
                width={64}
                height={64}
                className="h-12 w-12 object-contain"
                sizes="(min-width: 768px) 80px, 64px"
              />
            </div>

            {/* title */}
            <h3 className="mt-4 text-lg font-semibold text-modern-primary">
              {item.name}
            </h3>

            {/* body */}
            <div className="mt-2 text-sm text-modern-secondary">
              <p className="text-balance">{item.description}</p>
              {Array.isArray(item.sublist) && item.sublist.length > 0 && (
                <ul
                  role="list"
                  className="mt-4 space-y-1 text-left inline-block text-xs text-modern-light"
                >
                  {item.sublist.map((sub, i) => (
                    <li
                      key={`${item.name}-${i}`}
                      className="flex items-start gap-2"
                    >
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF6633]" />
                      <span>{sub}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* small link to detail pages */}
            <div className="mt-auto pt-5">
              {item.name === "Lifeguard Services" && (
                <a
                  href="/services"
                  className="text-sm font-medium text-[#FF6633] hover:text-[#e55a2b] transition-colors duration-300"
                >
                  Explore Services →
                </a>
              )}
              {item.name === "Lifeguard Courses" && (
                <a
                  href="/courses"
                  className="text-sm font-medium text-[#FF6633] hover:text-[#e55a2b] transition-colors duration-300"
                >
                  Explore Courses →
                </a>
              )}
              {item.name === "Water Safety" && (
                <a
                  href="/water-safety"
                  className="text-sm font-medium text-[#FF6633] hover:text-[#e55a2b] transition-colors duration-300"
                >
                  Explore Water Safety →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
