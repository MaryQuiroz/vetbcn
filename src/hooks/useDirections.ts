"use client";
import { useState, useCallback } from "react";

export interface DirectionsResult {
  routeCoords: [number, number][];
  distanceKm: number;
  durationMin: number;
}

export interface UseDirectionsReturn {
  loading: boolean;
  error: string | null;
  result: DirectionsResult | null;
  userLat: number | null;
  userLng: number | null;
  fetchDirections: (toLat: number, toLng: number) => Promise<void>;
  clear: () => void;
}

export function useDirections(): UseDirectionsReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DirectionsResult | null>(null);
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLng, setUserLng] = useState<number | null>(null);

  const fetchDirections = useCallback(async (toLat: number, toLng: number) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 8000 })
      );
      const fromLat = pos.coords.latitude;
      const fromLng = pos.coords.longitude;
      setUserLat(fromLat);
      setUserLng(fromLng);

      const url = `https://router.project-osrm.org/route/v1/driving/${fromLng},${fromLat};${toLng},${toLat}?overview=full&geometries=geojson`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("No se pudo calcular la ruta");
      const data = await res.json();
      if (!data.routes?.length) throw new Error("No se encontró ninguna ruta");

      const route = data.routes[0];
      const routeCoords: [number, number][] = route.geometry.coordinates.map(
        ([lng, lat]: [number, number]) => [lat, lng]
      );

      setResult({
        routeCoords,
        distanceKm: Math.round((route.distance / 1000) * 10) / 10,
        durationMin: Math.round(route.duration / 60),
      });
    } catch (err) {
      if (err instanceof GeolocationPositionError) {
        setError("No se pudo obtener tu ubicación");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error al calcular la ruta");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { loading, error, result, userLat, userLng, fetchDirections, clear };
}
