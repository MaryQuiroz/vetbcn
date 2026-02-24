"use client";

import { useState, useMemo } from "react";
import type { Clinic } from "@/types/clinic";
import { isOpenNow, haversineKm } from "@/utils/time";
import { useFavorites } from "@/hooks/useFavorites";
import FilterSidebar from "./FilterSidebar";
import ClinicGrid from "./ClinicGrid";
import ClinicMap from "./ClinicMap";
import FavoritesDrawer from "./FavoritesDrawer";
import PetOnboarding from "./PetOnboarding";
import GeoSortBar from "./GeoSortBar";
import EmergencyFloat from "./EmergencyFloat";

type SortBy = "rating" | "distance" | "name";

interface Props {
  clinics: Clinic[];
}

export default function HomeContent({ clinics }: Props) {
  const [view, setView] = useState<"list" | "map">("list");
  const [showOpenOnly, setShowOpenOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortBy>("rating");
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLng, setUserLng] = useState<number | null>(null);
  const [favDrawerOpen, setFavDrawerOpen] = useState(false);
  const { count } = useFavorites();

  const processed = useMemo(() => {
    let list = showOpenOnly
      ? clinics.filter(c => isOpenNow(c.hours ?? {}))
      : [...clinics];

    if (sortBy === "name") {
      list = list.sort((a, b) => a.name.localeCompare(b.name, "es"));
    } else if (sortBy === "distance" && userLat !== null && userLng !== null) {
      list = list.sort((a, b) =>
        haversineKm(userLat, userLng, a.lat ?? 41.385, a.lng ?? 2.173) -
        haversineKm(userLat, userLng, b.lat ?? 41.385, b.lng ?? 2.173)
      );
    } else {
      // rating (default)
      list = list.sort((a, b) => b.rating - a.rating);
    }
    return list;
  }, [clinics, showOpenOnly, sortBy, userLat, userLng]);

  return (
    <>
      <PetOnboarding />

      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{processed.length}</span>{" "}
            veterinario{processed.length !== 1 ? "s" : ""}
            {showOpenOnly && <span className="ml-1 font-medium text-green-600">· abiertos ahora</span>}
          </p>
          <button
            onClick={() => setShowOpenOnly(v => !v)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              showOpenOnly
                ? "bg-green-100 text-green-700 ring-1 ring-green-300"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            🟢 Abiertos ahora
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFavDrawerOpen(true)}
            className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100 transition-colors"
            aria-label="Mis favoritos"
          >
            <svg viewBox="0 0 24 24" fill={count > 0 ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className={`h-5 w-5 ${count > 0 ? "text-red-500" : ""}`}>
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                {count > 9 ? "9+" : count}
              </span>
            )}
          </button>

          <div className="flex overflow-hidden rounded-lg border border-gray-200 shadow-sm">
            <button
              onClick={() => setView("list")}
              className={`px-3 py-2 text-sm font-medium transition-colors ${view === "list" ? "bg-teal-700 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
            >
              📋 Lista
            </button>
            <button
              onClick={() => setView("map")}
              className={`border-l border-gray-200 px-3 py-2 text-sm font-medium transition-colors ${view === "map" ? "bg-teal-700 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
            >
              🗺️ Mapa
            </button>
          </div>
        </div>
      </div>

      <GeoSortBar
        clinics={processed}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onSorted={(_, lat, lng) => { setUserLat(lat); setUserLng(lng); }}
      />

      <div className="flex gap-8">
        <FilterSidebar />
        <div className="min-w-0 flex-1">
          {view === "map" ? (
            <ClinicMap clinics={processed} userLat={userLat} userLng={userLng} />
          ) : (
            <ClinicGrid clinics={processed} />
          )}
        </div>
      </div>

      <FavoritesDrawer
        clinics={clinics}
        isOpen={favDrawerOpen}
        onClose={() => setFavDrawerOpen(false)}
      />
      <EmergencyFloat />
    </>
  );
}
