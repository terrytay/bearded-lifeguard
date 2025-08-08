import { HeroList } from "@/content/Content";
import Image from "next/image";
import ClientCarousel from "./ImageSlider";
import { BookNowButton } from "./BookNow";

export function Hero() {
  return (
    <section className="flex flex-col w-full gap-10 text-[#20334F]">
      {/* Headline */}
      <div className="flex flex-col items-center text-center gap-4">
        <h1 className="whitespace-nowrap text-2xl sm:text-3xl md:text-5xl leading-tight font-bold">
          Your Safety, Our Priority
        </h1>
        <p className="max-w-2xl text-[#384152] pb-2">
          Your first line of defense in water safety — services, courses &
          certified lifeguards.
        </p>
        <BookNowButton isBold />
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
      <ul
        role="list"
        className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8"
      >
        {HeroList.map((item) => (
          <li
            key={item.name}
            className="group h-full flex flex-col rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm transition hover:shadow-md"
          >
            {/* icon */}
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
            <h3 className="mt-4 text-lg font-semibold">{item.name}</h3>

            {/* body */}
            <div className="mt-2 text-sm text-[#384152]">
              <p className="text-balance">{item.description}</p>
              {Array.isArray(item.sublist) && item.sublist.length > 0 && (
                <ul
                  role="list"
                  className="mt-4 space-y-1 text-left inline-block text-xs text-gray-600"
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
                  className="text-sm font-medium text-[#FF6633] hover:underline"
                >
                  Explore Services →
                </a>
              )}
              {item.name === "Lifeguard Courses" && (
                <a
                  href="/courses"
                  className="text-sm font-medium text-[#FF6633] hover:underline"
                >
                  Explore Courses →
                </a>
              )}
              {item.name === "Water Safety" && (
                <a
                  href="/water-safety"
                  className="text-sm font-medium text-[#FF6633] hover:underline"
                >
                  Explore Water Safety →
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
