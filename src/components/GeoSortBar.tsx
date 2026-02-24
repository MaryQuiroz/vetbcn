"use client";
import { useState } from "react";
import type { Clinic } from "@/types/clinic";
import { haversineKm } from "@/utils/time";

type SortBy = "rating" | "distance" | "name";

interface Props {
  clinics: Clinic[];
  sortBy: SortBy;
  onSortChange: (sort: SortBy) => void;
  onSorted: (sorted: Clinic[], userLat: number | null, userLng: number | null) => void;
}

export default function GeoSortBar({ clinics, sortBy, onSortChange, onSorted }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasLocation, setHasLocation] = useState(false);

  function requestLocation() {
    if (!navigator.geolocation) {
      setError("Tu navegador no soporta geolocalización");
      return;
    }
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setHasLocation(true);
        setLoading(false);
        onSortChange("distance");
        // Ordenar y notificar
        const sorted = [...clinics].sort((a, b) => {
          const da = haversineKm(lat, lng, a.lat ?? 41.385, a.lng ?? 2.173);
          const db = haversineKm(lat, lng, b.lat ?? 41.385, b.lng ?? 2.173);
          return da - db;
        });
        onSorted(sorted, lat, lng);
      },
      () => {
        setLoading(false);
        setError("No se pudo obtener la ubicación");
      },
      { timeout: 8000 }
    );
  }

  const SORT_OPTIONS: Array<{ value: SortBy; label: string }> = [
    { value: "rating", label: "Relevancia" },
    { value: "distance", label: "Distancia" },
    { value: "name", label: "Nombre" },
  ];

  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      {/* Geo button */}
      <button
        onClick={hasLocation ? undefined : requestLocation}
        disabled={loading}
        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
          hasLocation
            ? "bg-teal-100 text-teal-700 cursor-default"
            : "bg-white border border-gray-200 text-gray-600 hover:border-teal-400 hover:text-teal-700"
        }`}
      >
        {loading ? (
          <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-teal-500 border-t-transparent" />
        ) : (
          "📍"
        )}
        {loading ? "Obteniendo ubicación…" : hasLocation ? "Usando tu ubicación" : "Cerca de mí"}
      </button>

      {/* Sort pills */}
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-gray-400">Ordenar:</span>
        {SORT_OPTIONS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => onSortChange(value)}
            disabled={value === "distance" && !hasLocation}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              sortBy === value
                ? "bg-teal-700 text-white"
                : value === "distance" && !hasLocation
                ? "cursor-not-allowed text-gray-300"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
