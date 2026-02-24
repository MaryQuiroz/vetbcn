"use client";
import { useState, useEffect } from "react";
import { getOpenStatus } from "@/utils/time";

export default function OpenStatusBadge({ hours }: { hours: Record<string, string | null> }) {
  const [status, setStatus] = useState<ReturnType<typeof getOpenStatus> | null>(null);

  useEffect(() => {
    setStatus(getOpenStatus(hours));
    const interval = setInterval(() => setStatus(getOpenStatus(hours)), 60_000);
    return () => clearInterval(interval);
  }, [hours]);

  if (!status) return null;

  const colorMap = {
    green: "bg-green-100 text-green-700",
    amber: "bg-amber-100 text-amber-700",
    red: "bg-red-100 text-red-700",
  };

  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${colorMap[status.color]}`}>
      {status.label}
    </span>
  );
}
