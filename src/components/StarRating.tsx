interface StarRatingProps {
  rating: number;
  showNumber?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-xl",
};

export default function StarRating({
  rating,
  showNumber = false,
  size = "md",
}: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.25 && rating - fullStars < 0.75;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <span className={`inline-flex items-center gap-0.5 ${sizeClasses[size]}`}>
      {Array.from({ length: fullStars }, (_, i) => (
        <span key={`full-${i}`} className="text-amber-400">
          ★
        </span>
      ))}
      {hasHalf && <span className="text-amber-400">★</span>}
      {Array.from({ length: emptyStars }, (_, i) => (
        <span key={`empty-${i}`} className="text-gray-300">
          ★
        </span>
      ))}
      {showNumber && (
        <span className="ml-1 text-gray-600">({rating.toFixed(1)})</span>
      )}
    </span>
  );
}
