"use client";

interface Props {
  clinicName: string;
  clinicLat: number;
  clinicLng: number;
  distanceKm: number;
  durationMin: number;
  onClose: () => void;
}

export default function DirectionsPanel({
  clinicName,
  clinicLat,
  clinicLng,
  distanceKm,
  durationMin,
  onClose,
}: Props) {
  const apps = [
    {
      name: "Google Maps",
      url: `https://www.google.com/maps/dir/?api=1&destination=${clinicLat},${clinicLng}`,
      className:
        "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
    },
    {
      name: "Apple Maps",
      url: `https://maps.apple.com/?daddr=${clinicLat},${clinicLng}&dirflg=d`,
      className: "bg-gray-900 text-white hover:bg-gray-800",
    },
    {
      name: "Waze",
      url: `https://waze.com/ul?ll=${clinicLat},${clinicLng}&navigate=yes`,
      className: "bg-sky-500 text-white hover:bg-sky-600",
    },
  ];

  return (
    <div className="mt-4 rounded-xl border border-blue-100 bg-white p-3 sm:p-4 shadow-md">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Como llegar</h3>
        <button
          onClick={onClose}
          className="text-gray-400 transition-colors hover:text-gray-600"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-4 w-4"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="mb-3 space-y-0.5 text-sm text-gray-600">
        <p>Desde tu ubicacion</p>
        <p>{clinicName}</p>
      </div>

      <div className="mb-4 flex items-center gap-3 rounded-lg bg-blue-50 px-4 py-3">
        <div>
          <p className="font-semibold text-blue-900">
            {distanceKm} km · ~{durationMin} min
          </p>
          <p className="text-xs text-blue-600">en coche</p>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        {apps.map(({ name, url, className }) => (
          <a
            key={name}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex-1 rounded-lg px-2 py-2.5 text-center text-xs font-medium transition-colors ${className}`}
          >
            {name}
          </a>
        ))}
      </div>
    </div>
  );
}
