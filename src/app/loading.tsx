export default function Loading() {
  return (
    <div className="fixed inset-x-0 top-0 z-[9999]">
      <div className="h-0.5 w-full overflow-hidden bg-transparent">
        <div className="h-full w-1/3 bg-[#FF6633] animate-loader" />
      </div>
    </div>
  );
}
