import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 sm:px-6">
      <span className="text-6xl">🔍</span>
      <h2 className="mt-4 text-lg sm:text-xl font-semibold text-gray-900">
        Clinica no encontrada
      </h2>
      <p className="mt-2 text-sm sm:text-base text-gray-600">
        No hemos encontrado la clinica que buscas.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-teal-700 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-teal-600"
      >
        Volver al listado
      </Link>
    </div>
  );
}
