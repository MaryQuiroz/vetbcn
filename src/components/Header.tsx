"use client";
import Link from "next/link";

interface Props {
  onOpenFavorites?: () => void;
  favoritesCount?: number;
}

export default function Header({ onOpenFavorites, favoritesCount = 0 }: Props) {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl sm:text-2xl">🐾</span>
          <span className="text-lg sm:text-xl font-bold text-teal-700">VetBCN</span>
        </Link>
        <div className="flex items-center gap-4">
          <p className="hidden text-sm text-gray-500 sm:block">
            Encuentra el mejor veterinario de Barcelona
          </p>
          {onOpenFavorites && (
            <button
              onClick={onOpenFavorites}
              className="relative rounded-full p-2.5 text-gray-500 hover:bg-gray-100 hover:text-red-500 transition-colors"
              aria-label="Abrir favoritos"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              {favoritesCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {favoritesCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
