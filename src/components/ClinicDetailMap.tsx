"use client";

import type { Clinic } from "@/types/clinic";
import { useDirections } from "@/hooks/useDirections";
import ClinicMap from "@/components/ClinicMap";
import DirectionsPanel from "@/components/DirectionsPanel";

interface Props {
  clinic: Clinic;
}

export default function ClinicDetailMap({ clinic }: Props) {
  const { loading, error, result, userLat, userLng, fetchDirections, clear } =
    useDirections();

  if (!clinic.lat || !clinic.lng) return null;

  return (
    <section className="mt-8">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Ubicacion</h2>
        {!result && (
          <button
            onClick={() => fetchDirections(clinic.lat!, clinic.lng!)}
            disabled={loading}
            className="flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? (
              <>
                <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Calculando ruta…
              </>
            ) : (
              "Como llegar"
            )}
          </button>
        )}
        {result && (
          <button
            onClick={clear}
            className="text-xs text-gray-500 underline hover:text-gray-700"
          >
            Cancelar ruta
          </button>
        )}
      </div>

      <ClinicMap
        clinics={[clinic]}
        compact
        userLat={userLat}
        userLng={userLng}
        routeCoords={result?.routeCoords}
      />

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      {result && (
        <DirectionsPanel
          clinicName={clinic.name}
          clinicLat={clinic.lat}
          clinicLng={clinic.lng}
          distanceKm={result.distanceKm}
          durationMin={result.durationMin}
          onClose={clear}
        />
      )}

      {!result && !error && (
        <p className="mt-2 text-sm text-gray-500">{clinic.address}</p>
      )}
    </section>
  );
}
