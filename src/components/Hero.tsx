import { HeroList } from "@/content/Content";
import Image from "next/image";
import { BookNowButton } from "./BookNow";
import ClientCarousel from "./ImageSlider";
import { Cta } from "./Cta";

export function Hero() {
  return (
    <section className="flex flex-col w-full space-y-10 px-4 py-16 md:py-20 text-[#20334F]">
      <div className="flex flex-col w-full text-center space-y-8 items-center relative">
        <h1 className="whitespace-nowrap text-2xl sm:text-3xl md:text-5xl leading-tight font-bold text-[#20334F]">
          Your Safety, Our Priority
        </h1>
        <h2 className="z-10 text-balance">
          Your First Line of Defense in Water Safety — Services, Courses &
          Certified Lifeguards
        </h2>
        <BookNowButton isBold />
        <div className="flex items-end">
          <img className="rotate-123" src="/ui/arrow-curve.svg"></img>
          <div className="pb-3 text-xs text-gray-400 italic">
            Some of our awesome partners
          </div>
        </div>
        <ClientCarousel />
      </div>
      <ul
        role="list"
        className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:px-24 items-stretch"
      >
        {HeroList.map((item) => (
          <li
            key={item.name}
            className="group h-full flex flex-col rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-md"
          >
            {/* top: icon */}
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-50 ring-1 ring-orange-100">
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
            <h3 className="mt-4 text-lg font-semibold text-[#20334F]">
              {item.name}
            </h3>

            {/* body (fills remaining space before CTA) */}
            <div className="mt-2 text-sm text-gray-600 text-balance">
              <p>{item.description}</p>

              {Array.isArray(item.sublist) && item.sublist.length > 0 && (
                <ul
                  role="list"
                  className="mt-4 space-y-1 text-xs text-gray-500 text-left inline-block"
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

            {/* CTA pinned to bottom */}
            <div className="mt-auto pt-5">
              {item.name === "Lifeguard Services" && (
                <a
                  href="/lifeguard-services"
                  className="inline-flex items-center rounded-lg bg-[#FF6633] px-3 py-1.5 text-white shadow hover:opacity-90 text-sm"
                >
                  Explore Services
                </a>
              )}
              {item.name === "Lifeguard Courses" && (
                <a
                  href="/lifesaving-courses"
                  className="inline-flex items-center rounded-lg bg-[#FF6633] px-3 py-1.5 text-white shadow hover:opacity-90 text-sm"
                >
                  Explore Courses
                </a>
              )}
              {item.name === "Water Safety" && (
                <a
                  href="/events2"
                  className="inline-flex items-center rounded-lg bg-[#FF6633] px-3 py-1.5 text-white shadow hover:opacity-90 text-sm"
                >
                  Explore Water Safety
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
