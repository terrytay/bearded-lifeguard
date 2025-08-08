import Link from "next/link";

export function BookNowButton({ isBold }: { isBold: boolean }) {
  return (
    <div className="flex justify-end items-center py-2">
      {isBold ? (
        <Link
          href="/booking"
          className="border bg-orange-500 border-orange-500 text-white rounded-md px-12 py-4 hover:bg-[#20334F] hover:border-[#20334F] drop-shadow-[0_0_20px_#FF6633] transition"
        >
          Book Now
        </Link>
      ) : (
        <Link
          href="/booking"
          className="border border-orange-500 rounded-md px-4 py-2"
        >
          Book Now
        </Link>
      )}
    </div>
  );
}
