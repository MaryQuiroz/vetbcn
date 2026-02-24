"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const PETS = [
  { label: "Perros", emoji: "🐶" },
  { label: "Gatos", emoji: "🐱" },
  { label: "Aves", emoji: "🦜" },
  { label: "Reptiles", emoji: "🦎" },
  { label: "Conejos", emoji: "🐰" },
  { label: "Exoticos", emoji: "🐾" },
];

export default function PetOnboarding() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const done = localStorage.getItem("vetbcn_onboarding");
    if (!done) {
      setShow(true);
      // Pequeño delay para la animación de entrada
      setTimeout(() => setVisible(true), 50);
    }
  }, []);

  function dismiss(animal?: string) {
    setVisible(false);
    localStorage.setItem("vetbcn_onboarding", "done");
    setTimeout(() => {
      setShow(false);
      if (animal) router.push(`/?animal=${animal}`);
    }, 300);
  }

  if (!show) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-sm transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}>
      <div className={`mx-4 w-full max-w-md transition-all duration-300 ${visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
        {/* Logo */}
        <div className="mb-6 text-center">
          <span className="text-4xl">🐾</span>
          <span className="ml-2 text-2xl font-bold text-teal-700">VetBCN</span>
        </div>

        <h2 className="mb-2 text-center text-2xl font-bold text-gray-900">
          ¿Qué mascota tienes?
        </h2>
        <p className="mb-8 text-center text-sm text-gray-500">
          Te mostramos las clínicas más relevantes para ti
        </p>

        <div className="grid grid-cols-3 gap-3">
          {PETS.map(({ label, emoji }) => (
            <button
              key={label}
              onClick={() => dismiss(label)}
              className="flex flex-col items-center gap-2 rounded-2xl border-2 border-gray-100 bg-white p-4 transition-all hover:border-teal-400 hover:bg-teal-50 hover:scale-105 active:scale-95"
            >
              <span className="text-3xl">{emoji}</span>
              <span className="text-xs font-medium text-gray-700">{label}</span>
            </button>
          ))}
        </div>

        <button
          onClick={() => dismiss()}
          className="mt-6 block w-full text-center text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          Saltar →
        </button>
      </div>
    </div>
  );
}
