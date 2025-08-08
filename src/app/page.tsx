import { Hero } from "@/components/Hero";

export default function Home() {
  return (
    <main className="bg-[#fafafa]">
      <section className="px-4 py-16 md:py-20">
        <div className="mx-auto max-w-7xl">
          <Hero />
        </div>
      </section>
    </main>
  );
}
