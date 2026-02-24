"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

function EmergencyFloatInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isActive = searchParams.get("emergency") === "true";

  if (isActive) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={() => router.push("/?emergency=true")}
        title="Ver clínicas con urgencias 24h abiertas"
        className="flex items-center gap-2 rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-200 transition-all hover:bg-red-700 hover:scale-105 animate-pulse"
      >
        🚨 Urgencias
      </button>
    </div>
  );
}

export default function EmergencyFloat() {
  return (
    <Suspense fallback={null}>
      <EmergencyFloatInner />
    </Suspense>
  );
}
