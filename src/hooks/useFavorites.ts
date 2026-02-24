"use client";
import { useState, useCallback } from "react";

export interface UseFavoritesReturn {
  favorites: string[];
  isFavorite: (id: string) => boolean;
  toggle: (id: string) => void;
  count: number;
}

export function useFavorites(): UseFavoritesReturn {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("vetbcn_favorites") || "[]");
    } catch {
      return [];
    }
  });

  const toggle = useCallback((id: string) => {
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      try { localStorage.setItem("vetbcn_favorites", JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);

  return { favorites, isFavorite, toggle, count: favorites.length };
}
