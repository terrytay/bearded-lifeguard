import BookingClient from "@/components/BookingClient";

export default function BookingPage() {
  const ref = `BL-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  const createdAt = new Date().toISOString();

  return <BookingClient initialRef={ref} createdAt={createdAt} />;
}
