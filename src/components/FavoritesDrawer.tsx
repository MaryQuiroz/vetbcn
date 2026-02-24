"use client";
import Link from "next/link";
import type { Clinic } from "@/types/clinic";
import { useFavorites } from "@/hooks/useFavorites";

interface Props {
  clinics: Clinic[];
  isOpen: boolean;
  onClose: () => void;
}

export default function FavoritesDrawer({ clinics, isOpen, onClose }: Props) {
  const { favorites, toggle } = useFavorites();
  const favClinics = clinics.filter(c => favorites.includes(c.id));

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4">
          <h2 className="text-base font-semibold text-gray-900">Mis favoritos</h2>
          <button onClick={onClose} className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-2">
          {favClinics.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <span className="text-5xl">🤍</span>
              <p className="mt-4 text-sm font-medium text-gray-900">Todavia no tienes favoritos</p>
              <p className="mt-1 text-xs text-gray-500">Toca el corazon en cualquier clinica para guardarla aqui</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {favClinics.map(clinic => (
                <li key={clinic.id} className="flex items-center gap-3 py-3">
                  <Link href={`/${clinic.slug}`} onClick={onClose} className="min-w-0 flex-1">
                    <p className="truncate font-medium text-gray-900 hover:text-teal-700">{clinic.name}</p>
                    <p className="text-xs text-gray-500">{clinic.barrio} · {clinic.rating.toFixed(1)}</p>
                  </Link>
                  <button
                    onClick={() => toggle(clinic.id)}
                    className="shrink-0 rounded-full p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600"
                    aria-label="Quitar de favoritos"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                      <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
