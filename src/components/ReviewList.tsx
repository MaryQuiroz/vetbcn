import ReviewCard from "./ReviewCard";

interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: Date;
  helpful: number;
}

interface ReviewListProps {
  reviews: Review[];
  averageRating: number;
  totalCount: number;
}

export default function ReviewList({
  reviews,
  averageRating,
  totalCount,
}: ReviewListProps) {
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  return (
    <section className="mt-10">
      <h2 className="text-lg font-semibold text-gray-900">
        Valoraciones ({totalCount})
      </h2>

      <div className="mt-4 grid gap-4 sm:gap-6 lg:gap-8 lg:grid-cols-[280px_1fr]">
        {/* Rating summary */}
        <div className="space-y-3">
          <div className="flex items-baseline gap-2">
            <p className="text-4xl font-bold text-gray-900 sm:text-5xl">
              {averageRating.toFixed(1)}
            </p>
            <span className="text-lg text-amber-400">
              {"★".repeat(Math.round(averageRating))}
              {"☆".repeat(5 - Math.round(averageRating))}
            </span>
          </div>
          <p className="text-sm text-gray-500">
            {totalCount} valoraciones
          </p>

          <div className="space-y-1 sm:space-y-1.5">
            {distribution.map(({ star, count }) => {
              const pct = totalCount > 0 ? (count / totalCount) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-2 text-sm">
                  <span className="w-6 text-right text-gray-600">{star}★</span>
                  <div className="h-2 flex-1 rounded-full bg-gray-100">
                    <div
                      style={{ width: `${pct}%` }}
                      className="h-2 rounded-full bg-teal-500"
                    />
                  </div>
                  <span className="w-6 text-right text-gray-400">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Review cards grid */}
        {reviews.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {reviews.map((r) => (
              <ReviewCard key={r.id} {...r} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">Aún no hay valoraciones</p>
        )}
      </div>
    </section>
  );
}
