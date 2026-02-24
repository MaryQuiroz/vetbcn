import Link from "next/link";
import Image from "next/image";
import type { Clinic } from "@/types/clinic";
import StarRating from "./StarRating";
import PriceBadge from "./PriceBadge";
import OpenStatusBadge from "./OpenStatusBadge";
import HeartButton from "@/components/HeartButton";
import { getClinicPhotoUrl } from "@/utils/clinicPhoto";

const animalEmojis: Record<string, string> = {
  Perros: "🐶",
  Gatos: "🐱",
  Aves: "🦜",
  Reptiles: "🦎",
  Conejos: "🐰",
  "Exoticos": "🐾",
};

interface ClinicCardProps {
  clinic: Clinic;
}

export default function ClinicCard({ clinic }: ClinicCardProps) {
  return (
    <div className="relative group overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
      <div className="absolute left-2 top-2 z-10">
        <HeartButton clinicId={clinic.id} />
      </div>

      <Link href={`/${clinic.slug}`} className="block">
        {/* Image */}
        <div className="relative h-40 overflow-hidden bg-gradient-to-br from-teal-600 to-teal-800">
          <Image
            src={clinic.imageUrl ?? getClinicPhotoUrl(clinic.id, clinic.animalTypes)}
            alt={clinic.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover opacity-80 transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute right-2 top-2 flex flex-col items-end gap-1">
            {clinic.isEmergency && (
              <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">
                🚨 24h
              </span>
            )}
            <OpenStatusBadge hours={clinic.hours ?? {}} />
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Name + Price */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-gray-900 group-hover:text-teal-700">
              {clinic.name}
            </h3>
            <PriceBadge price={clinic.price} />
          </div>

          {/* Rating + Barrio */}
          <div className="mt-1 flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <StarRating rating={clinic.rating} size="sm" />
              <span className="text-gray-500">({clinic.reviewCount})</span>
            </div>
            <span className="text-gray-500">{clinic.barrio}</span>
          </div>

          {/* Animals + Specialties */}
          <div className="mt-3 flex flex-wrap items-center gap-1 text-sm text-gray-600">
            <span>
              {clinic.animalTypes
                .map((a) => animalEmojis[a] || "🐾")
                .join("")}
            </span>
            <span className="mx-1 text-gray-300">|</span>
            <span className="truncate">
              {clinic.specialties.slice(0, 3).join(" · ")}
            </span>
          </div>

          {/* Address */}
          <p className="mt-2 truncate text-sm text-gray-500">
            📍 {clinic.address}
          </p>
        </div>
      </Link>
    </div>
  );
}
