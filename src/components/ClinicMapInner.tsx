"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Clinic } from "@/types/clinic";

// Custom SVG pin — avoids webpack asset resolution issues with default Leaflet markers
function createMarkerIcon(isEmergency: boolean) {
  const color = isEmergency ? "#ef4444" : "#0f766e";
  return L.divIcon({
    html: `
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">
        <path d="M14 0C6.27 0 0 6.27 0 14c0 10.5 14 22 14 22S28 24.5 28 14C28 6.27 21.73 0 14 0z" fill="${color}"/>
        <circle cx="14" cy="14" r="6" fill="white" opacity="0.9"/>
        <text x="14" y="18" text-anchor="middle" font-size="9" fill="${color}">🐾</text>
      </svg>`,
    className: "",
    iconSize: [28, 36],
    iconAnchor: [14, 36],
    popupAnchor: [0, -38],
  });
}

const userLocationIcon = L.divIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="11" fill="#3b82f6" opacity="0.25"/>
    <circle cx="12" cy="12" r="6" fill="#3b82f6" stroke="white" stroke-width="2.5"/>
  </svg>`,
  className: "",
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -14],
});

interface BoundsProps {
  clinics: Clinic[];
  userLat?: number | null;
  userLng?: number | null;
}

function BoundsAdjuster({ clinics, userLat, userLng }: BoundsProps) {
  const map = useMap();
  useEffect(() => {
    const pts: [number, number][] = clinics
      .filter((c) => c.lat && c.lng)
      .map((c) => [c.lat!, c.lng!]);
    if (userLat && userLng) pts.push([userLat, userLng]);
    if (pts.length === 0) return;
    if (pts.length === 1) {
      map.setView(pts[0], 15);
      return;
    }
    map.fitBounds(L.latLngBounds(pts), { padding: [48, 48] });
  }, [clinics, map, userLat, userLng]);
  return null;
}

interface Props {
  clinics: Clinic[];
  compact?: boolean;
  userLat?: number | null;
  userLng?: number | null;
  routeCoords?: [number, number][] | null;
}

export default function ClinicMapInner({ clinics, compact = false, userLat, userLng, routeCoords }: Props) {
  const withCoords = clinics.filter((c) => c.lat && c.lng);
  const barcelonaCenter: [number, number] = [41.3851, 2.1734];

  return (
    <MapContainer
      center={barcelonaCenter}
      zoom={13}
      style={{ height: compact ? "260px" : "520px", width: "100%" }}
      className="rounded-xl"
      scrollWheelZoom={!compact}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <BoundsAdjuster clinics={withCoords} userLat={userLat} userLng={userLng} />
      {routeCoords && routeCoords.length > 0 && (
        <Polyline positions={routeCoords} color="#3b82f6" weight={4} opacity={0.75} />
      )}
      {userLat && userLng && (
        <Marker position={[userLat, userLng]} icon={userLocationIcon}>
          <Popup>
            <p className="font-medium text-blue-600">📍 Tu ubicación</p>
          </Popup>
        </Marker>
      )}
      {withCoords.map((clinic) => (
        <Marker
          key={clinic.id}
          position={[clinic.lat!, clinic.lng!]}
          icon={createMarkerIcon(clinic.isEmergency)}
        >
          <Popup minWidth={200}>
            <div className="py-1">
              <p className="font-semibold text-gray-900 leading-tight">
                {clinic.name}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{clinic.barrio}</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-amber-400 text-xs leading-none">
                  {"★".repeat(Math.round(clinic.rating))}
                  {"☆".repeat(5 - Math.round(clinic.rating))}
                </span>
                <span className="text-xs text-gray-600">
                  {clinic.rating.toFixed(1)}
                </span>
                {clinic.isEmergency && (
                  <span className="ml-1 text-xs text-red-600 font-medium">
                    · 24h
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">{clinic.address}</p>
              {!compact && (
                <>
                  <a
                    href={`/${clinic.slug}`}
                    className="mt-2 inline-block text-xs font-medium text-teal-700 hover:underline"
                  >
                    Ver detalles →
                  </a>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${clinic.lat},${clinic.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block text-xs font-medium text-blue-600 hover:underline"
                  >
                    🗺️ Google Maps →
                  </a>
                </>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
