"use client";

import dynamic from "next/dynamic";
import type { Clinic } from "@/types/clinic";

const ClinicMapInner = dynamic(() => import("./ClinicMapInner"), {
  ssr: false,
  loading: () => (
    <div
      className="w-full animate-pulse rounded-xl bg-gray-200 flex items-center justify-center text-gray-400 text-sm"
      style={{ height: "520px" }}
    >
      Cargando mapa…
    </div>
  ),
});

const ClinicMapCompact = dynamic(() => import("./ClinicMapInner"), {
  ssr: false,
  loading: () => (
    <div
      className="w-full animate-pulse rounded-xl bg-gray-200 flex items-center justify-center text-gray-400 text-sm"
      style={{ height: "260px" }}
    >
      Cargando mapa…
    </div>
  ),
});

interface Props {
  clinics: Clinic[];
  compact?: boolean;
  userLat?: number | null;
  userLng?: number | null;
  routeCoords?: [number, number][] | null;
}

export default function ClinicMap({ clinics, compact = false, userLat, userLng, routeCoords }: Props) {
  if (compact) {
    return <ClinicMapCompact clinics={clinics} compact routeCoords={routeCoords} />;
  }
  return <ClinicMapInner clinics={clinics} userLat={userLat} userLng={userLng} routeCoords={routeCoords} />;
}
