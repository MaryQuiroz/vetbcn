"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const ANIMALS = [
  { label: "Perros", emoji: "🐶" },
  { label: "Gatos", emoji: "🐱" },
  { label: "Aves", emoji: "🦜" },
  { label: "Reptiles", emoji: "🦎" },
  { label: "Conejos", emoji: "🐰" },
  { label: "Exoticos", emoji: "🐾" },
];

const BARRIOS = [
  "Can Baró",
  "el Baix Guinardó",
  "el Barri Gòtic",
  "el Camp d'en Grassot i Gràcia Nova",
  "el Camp de l'Arpa del Clot",
  "el Carmel",
  "el Clot",
  "el Congrés i els Indians",
  "el Fort Pienc",
  "el Poble-sec",
  "el Poblenou",
  "el Putxet i el Farró",
  "el Raval",
  "Horta",
  "l'Antiga Esquerra de l'Eixample",
  "la Bordeta",
  "la Dreta de l'Eixample",
  "la Font de la Guatlla",
  "la Guineueta",
  "la Marina de Port",
  "la Nova Esquerra de l'Eixample",
  "la Prosperitat",
  "la Sagrera",
  "la Salut",
  "la Verneda i la Pau",
  "la Vila de Gràcia",
  "les Corts",
  "les Tres Torres",
  "Sant Antoni",
  "Sant Gervasi - Galvany",
  "Sant Gervasi - la Bonanova",
  "Sant Martí de Provençals",
  "Sant Pere, Santa Caterina i la Ribera",
  "Sants",
  "Sants - Badal",
  "Vilapicina i la Torre Llobeta",
];

const RATING_OPTIONS = [3, 4, 4.5];
const PRICE_OPTIONS: Array<1 | 2 | 3> = [1, 2, 3];

export default function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const selectedAnimals = searchParams.getAll("animal");
  const selectedBarrio = searchParams.get("barrio") || "";
  const selectedRating = searchParams.get("rating") || "";
  const selectedPrices = searchParams.getAll("price");
  const emergencyOnly = searchParams.get("emergency") === "true";

  function updateParams(key: string, value: string, multi = false) {
    const params = new URLSearchParams(searchParams.toString());

    if (multi) {
      const current = params.getAll(key);
      if (current.includes(value)) {
        params.delete(key);
        current
          .filter((v) => v !== value)
          .forEach((v) => params.append(key, v));
      } else {
        params.append(key, value);
      }
    } else {
      if (params.get(key) === value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }

    router.push(`/?${params.toString()}`);
  }

  function clearAll() {
    const params = new URLSearchParams();
    const search = searchParams.get("search");
    if (search) params.set("search", search);
    router.push(`/?${params.toString()}`);
  }

  const sidebar = (
    <div className="space-y-6">
      {/* Tipo de animal */}
      <section>
        <h3 className="mb-2 text-sm font-semibold text-gray-900">
          Tipo de animal
        </h3>
        <div className="flex flex-wrap gap-2">
          {ANIMALS.map(({ label, emoji }) => (
            <button
              key={label}
              onClick={() => updateParams("animal", label, true)}
              className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                selectedAnimals.includes(label)
                  ? "border-teal-600 bg-teal-50 text-teal-700"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}
            >
              {emoji} {label}
            </button>
          ))}
        </div>
      </section>

      {/* Barrio */}
      <section>
        <h3 className="mb-2 text-sm font-semibold text-gray-900">Barrio</h3>
        <select
          value={selectedBarrio}
          onChange={(e) => {
            const params = new URLSearchParams(searchParams.toString());
            if (e.target.value) {
              params.set("barrio", e.target.value);
            } else {
              params.delete("barrio");
            }
            router.push(`/?${params.toString()}`);
          }}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
        >
          <option value="">Todos los barrios</option>
          {BARRIOS.map((barrio) => (
            <option key={barrio} value={barrio}>
              {barrio}
            </option>
          ))}
        </select>
      </section>

      {/* Rating minimo */}
      <section>
        <h3 className="mb-2 text-sm font-semibold text-gray-900">
          Rating minimo
        </h3>
        <div className="flex gap-2">
          {RATING_OPTIONS.map((r) => (
            <button
              key={r}
              onClick={() => updateParams("rating", String(r))}
              className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                selectedRating === String(r)
                  ? "border-teal-600 bg-teal-50 text-teal-700"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}
            >
              {r}★
            </button>
          ))}
        </div>
      </section>

      {/* Precio */}
      <section>
        <h3 className="mb-2 text-sm font-semibold text-gray-900">Precio</h3>
        <div className="flex gap-2">
          {PRICE_OPTIONS.map((p) => (
            <button
              key={p}
              onClick={() => updateParams("price", String(p), true)}
              className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                selectedPrices.includes(String(p))
                  ? "border-teal-600 bg-teal-50 text-teal-700"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}
            >
              {"€".repeat(p)}
            </button>
          ))}
        </div>
      </section>

      {/* Urgencias */}
      <section>
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={emergencyOnly}
            onChange={() =>
              updateParams("emergency", emergencyOnly ? "" : "true")
            }
            className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
          />
          <span className="text-sm text-gray-700">Solo urgencias 24h</span>
        </label>
      </section>

      {/* Limpiar */}
      <button
        onClick={clearAll}
        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-600 transition-colors hover:bg-gray-50"
      >
        Limpiar filtros
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <div className="lg:hidden">
        <button
          onClick={() => setOpen(!open)}
          className="mb-4 flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <span>🎛️</span> Filtros
          {open ? " ▲" : " ▼"}
        </button>
        {open && (
          <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
            {sidebar}
          </div>
        )}
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="sticky top-4 rounded-lg border border-gray-200 bg-white p-4">
          {sidebar}
        </div>
      </aside>
    </>
  );
}
