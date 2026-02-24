import Link from "next/link";
import type { Clinic } from "@/types/clinic";
import ClinicCard from "./ClinicCard";

interface ClinicGridProps {
  clinics: Clinic[];
  emptyMessage?: string;
}

export default function ClinicGrid({
  clinics,
  emptyMessage = "No se encontraron clínicas con estos filtros.",
}: ClinicGridProps) {
  if (clinics.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <span className="text-6xl">🔍</span>
        <p className="mt-4 text-lg text-gray-600">{emptyMessage}</p>
        <Link
          href="/"
          className="mt-4 rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-600"
        >
          Limpiar filtros
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
      {clinics.map((clinic) => (
        <ClinicCard key={clinic.id} clinic={clinic} />
      ))}
    </div>
  );
}
