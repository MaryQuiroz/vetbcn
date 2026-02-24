"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useRef, useState } from "react";

function SearchBarInner({ initialValue }: { initialValue: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(initialValue);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pushSearch = useCallback(
    (newValue: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (newValue) {
        params.set("search", newValue);
      } else {
        params.delete("search");
      }
      router.push(`/?${params.toString()}`);
    },
    [router, searchParams],
  );

  function updateSearch(newValue: string) {
    setValue(newValue);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      pushSearch(newValue);
    }, 300);
  }

  function clear() {
    setValue("");
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    router.push(`/?${params.toString()}`);
  }

  return (
    <div className="relative w-full max-w-2xl">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        🔍
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => updateSearch(e.target.value)}
        placeholder="Busca por nombre, especialidad o barrio..."
        className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-10 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
      />
      {value && (
        <button
          onClick={clear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          aria-label="Limpiar busqueda"
        >
          ✕
        </button>
      )}
    </div>
  );
}

export default function SearchBar() {
  const searchParams = useSearchParams();
  const searchValue = searchParams.get("search") || "";

  return <SearchBarInner key={searchValue} initialValue={searchValue} />;
}
