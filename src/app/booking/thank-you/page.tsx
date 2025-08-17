// src/app/booking/thank-you/page.tsx
export default function ThankYou({
  searchParams,
}: {
  searchParams: { order?: string; amount?: string };
}) {
  const order = searchParams.order ?? "—";
  const amount = searchParams.amount ?? "—";
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 text-center">
      <h1 className="text-3xl md:text-4xl font-bold text-[#20334F]">
        Thank you!
      </h1>
      <p className="mt-3 text-gray-600">
        We’ve recorded your payment. Your reference is <strong>{order}</strong>.
      </p>
      <p className="mt-1 text-gray-600">
        Amount paid: <strong>${amount}</strong>
      </p>
      <p className="mt-6 text-sm text-gray-500">
        A confirmation email will arrive shortly.
      </p>
    </main>
  );
}
