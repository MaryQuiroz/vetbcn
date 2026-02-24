interface PriceBadgeProps {
  price: number;
}

export default function PriceBadge({ price }: PriceBadgeProps) {
  return (
    <span className="inline-flex text-sm font-medium">
      {[1, 2, 3].map((level) => (
        <span
          key={level}
          className={level <= price ? "text-teal-700" : "text-gray-300"}
        >
          &euro;
        </span>
      ))}
    </span>
  );
}
