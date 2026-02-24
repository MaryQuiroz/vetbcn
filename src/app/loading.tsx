export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Header skeleton */}
      <div className="border-b border-gray-200 bg-white px-4 py-4">
        <div className="mx-auto flex max-w-7xl items-center gap-2">
          <div className="h-8 w-8 animate-pulse rounded bg-gray-200" />
          <div className="h-6 w-24 animate-pulse rounded bg-gray-200" />
        </div>
      </div>

      {/* Hero skeleton */}
      <div className="bg-gradient-to-b from-teal-50 to-white px-4 py-10 text-center sm:py-16">
        <div className="mx-auto h-10 w-64 animate-pulse rounded bg-gray-200" />
        <div className="mx-auto mt-4 h-10 w-80 animate-pulse rounded bg-gray-200" />
        <div className="mx-auto mt-6 h-12 w-full max-w-2xl animate-pulse rounded-lg bg-gray-200" />
      </div>

      {/* Grid skeleton */}
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 h-4 w-48 animate-pulse rounded bg-gray-200" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-lg bg-white shadow-sm"
            >
              <div className="h-36 animate-pulse bg-gray-200 sm:h-40" />
              <div className="space-y-2 p-4">
                <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
