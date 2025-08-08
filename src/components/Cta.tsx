export function Cta() {
  return (
    <section className=" pb-20">
      <div className="mx-auto max-w-7xl rounded-2xl bg-[#20334F] p-6 md:p-10">
        <h3 className="text-2xl md:text-3xl font-semibold text-white">
          Ready to make water safer?
        </h3>
        <p className="mt-2 text-white/80">
          Choose the path that fits your needs — hire certified lifeguards,
          enroll in courses, or book a water safety talk.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="/lifeguard-services"
            className="inline-flex items-center rounded-lg bg-[#FF6633] px-4 py-2 text-white shadow hover:opacity-90"
          >
            Lifeguard Services
          </a>
          <a
            href="/lifesaving-courses"
            className="inline-flex items-center rounded-lg bg-white px-4 py-2 text-[#20334F] shadow hover:bg-gray-50"
          >
            Courses
          </a>
          <a
            href="/events2"
            className="inline-flex items-center rounded-lg bg-white/10 px-4 py-2 text-white ring-1 ring-white/25 hover:bg-white/15"
          >
            Water Safety
          </a>
        </div>
      </div>
    </section>
  );
}
