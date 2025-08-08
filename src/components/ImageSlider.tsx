"use client";

import { logos } from "@/content/Content";
import { useEffect, useRef } from "react";

export default function ClientCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const firstRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const speedPxPerSec = 120;
    let last = 0;

    const measure = () => firstRef.current?.scrollWidth ?? 0;

    const tick = (now: number) => {
      if (!last) last = now;
      const dt = (now - last) / 1000;
      last = now;

      const firstW = measure();
      if (!trackRef.current || !firstW) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      offsetRef.current = (offsetRef.current + speedPxPerSec * dt) % firstW;
      trackRef.current.style.transform = `translate3d(${-offsetRef.current}px,0,0)`;
      rafRef.current = requestAnimationFrame(tick);
    };

    // Start only after images are loaded (first copy eager)
    const start = () => {
      cancelAnimationFrame(rafRef.current!);
      offsetRef.current = 0;
      if (trackRef.current)
        trackRef.current.style.transform = "translate3d(0,0,0)";
      last = 0;
      rafRef.current = requestAnimationFrame(tick);
    };

    // If images are cached, measure immediately; otherwise wait for load.
    const imgs = Array.from(firstRef.current?.querySelectorAll("img") ?? []);
    let loaded = 0;
    const onImg = () => {
      loaded++;
      if (loaded >= imgs.length) {
        // give layout one frame to settle
        requestAnimationFrame(() => requestAnimationFrame(start));
      }
    };
    if (imgs.length === 0) start();
    else
      imgs.forEach((img) =>
        img.complete
          ? onImg()
          : (img.addEventListener("load", onImg, { once: true }),
            img.addEventListener("error", onImg, { once: true }))
      );

    const onResize = () => {
      // force re-measure and restart after layout changes
      requestAnimationFrame(() => requestAnimationFrame(start));
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="relative w-full overflow-hidden -mt-8 py-4 bg-orange-50 flex">
      <div className="pointer-events-none absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-[#fafafa] to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-[#fafafa] to-transparent z-10" />

      {/* IMPORTANT: no animate-* classes here */}
      <div
        ref={trackRef}
        className="flex flex-nowrap items-center will-change-transform"
      >
        {/* first (eager) */}
        <div ref={firstRef} className="flex flex-nowrap items-center gap-8">
          {logos.map((src, i) => (
            <div
              key={`a-${i}`}
              className="shrink-0 w-36 sm:w-40 md:w-44 h-16 md:h-20 flex items-center justify-center"
            >
              <img
                src={src}
                alt=""
                loading="eager"
                decoding="sync"
                className="max-h-full max-w-full object-contain block select-none pointer-events-none"
              />
            </div>
          ))}
        </div>

        {/* duplicate (lazy) */}
        <div className="flex flex-nowrap items-center gap-8" aria-hidden="true">
          {logos.map((src, i) => (
            <div
              key={`b-${i}`}
              className="shrink-0 w-36 sm:w-40 md:w-44 h-16 md:h-20 flex items-center justify-center"
            >
              <img
                src={src}
                alt=""
                loading="lazy"
                decoding="async"
                className="max-h-full max-w-full object-contain block select-none pointer-events-none"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
