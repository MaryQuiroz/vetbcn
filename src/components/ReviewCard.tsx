interface ReviewCardProps {
  author: string;
  rating: number;
  comment: string;
  date: Date | string;
  helpful: number;
}

function relativeDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const diff = (d.getTime() - Date.now()) / 1000;
  const rtf = new Intl.RelativeTimeFormat("es", { numeric: "auto" });
  const abs = Math.abs(diff);
  if (abs < 86400) return rtf.format(Math.round(diff / 3600), "hour");
  if (abs < 2592000) return rtf.format(Math.round(diff / 86400), "day");
  if (abs < 31536000) return rtf.format(Math.round(diff / 2592000), "month");
  return rtf.format(Math.round(diff / 31536000), "year");
}

export default function ReviewCard({
  author,
  rating,
  comment,
  date,
  helpful,
}: ReviewCardProps) {
  const formattedDate = relativeDate(date);

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-700">
          {author[0]}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-medium text-gray-900">{author}</span>
            <span className="text-xs text-gray-400">{formattedDate}</span>
          </div>
          <div className="mt-0.5 flex items-center gap-1 text-amber-400">
            <span>{"★".repeat(rating)}{"☆".repeat(5 - rating)}</span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            {comment}
          </p>
          {helpful > 0 && (
            <p className="mt-2 text-xs text-gray-400">
              {helpful} personas encontraron esto útil
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
