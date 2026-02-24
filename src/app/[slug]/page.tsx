import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getClinicBySlug, getRelatedClinics, getReviews } from "@/lib/clinics";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StarRating from "@/components/StarRating";
import PriceBadge from "@/components/PriceBadge";
import Badge from "@/components/Badge";
import ClinicCard from "@/components/ClinicCard";
import type { Clinic } from "@/types/clinic";
import ClinicDetailMap from "@/components/ClinicDetailMap";
import ReviewList from "@/components/ReviewList";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const clinic = await getClinicBySlug(slug);
  if (!clinic) {
    return { title: "Clínica no encontrada | VetBCN" };
  }
  return {
    title: `${clinic.name} | VetBCN`,
    description: clinic.description || `${clinic.name} - Clínica veterinaria en ${clinic.barrio}, Barcelona`,
  };
}

const animalEmojis: Record<string, string> = {
  Perros: "🐶",
  Gatos: "🐱",
  Aves: "🦜",
  Reptiles: "🦎",
  Conejos: "🐰",
  "Exoticos": "🐾",
};

const dayOrder = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"];

export default async function ClinicDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const clinic = await getClinicBySlug(slug);

  if (!clinic) {
    notFound();
  }

  const typedClinic = clinic as Clinic;
  const [related, reviews] = await Promise.all([
    getRelatedClinics(typedClinic.barrio, typedClinic.id),
    getReviews(typedClinic.id),
  ]);

  const hours = typedClinic.hours || {};

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />

      {/* Back link */}
      <div className="mx-auto w-full max-w-5xl px-4 pt-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-teal-700 hover:text-teal-600"
        >
          &larr; Volver al listado
        </Link>
      </div>

      {/* Hero */}
      <section className="relative mt-4 flex h-64 items-end bg-gradient-to-br from-teal-600 to-teal-800 sm:h-72">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl opacity-20">🐾</span>
        </div>
        <div className="relative z-10 mx-auto w-full max-w-5xl px-4 pb-6 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            {typedClinic.name}
          </h1>
          {typedClinic.isEmergency && (
            <span className="mt-2 inline-block rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white">
              🚨 Urgencias 24h
            </span>
          )}
        </div>
        {typedClinic.phone && (
          <a
            href={`tel:${typedClinic.phone}`}
            className="absolute right-4 top-4 rounded-lg bg-white/90 px-4 py-2 text-sm font-medium text-teal-700 shadow transition-colors hover:bg-white sm:right-8"
          >
            📞 Llamar
          </a>
        )}
      </section>

      {/* Detail content */}
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {/* Rating + Price */}
        <div className="flex items-center gap-3">
          <StarRating rating={typedClinic.rating} showNumber size="lg" />
          <span className="text-gray-500">
            · {typedClinic.reviewCount} valoraciones
          </span>
          <PriceBadge price={typedClinic.price} />
        </div>

        {/* Tags */}
        <div className="mt-6 space-y-3">
          {typedClinic.specialties.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {typedClinic.specialties.map((s) => (
                <Badge key={s} label={s} variant="specialty" />
              ))}
            </div>
          )}
          {typedClinic.animalTypes.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {typedClinic.animalTypes.map((a) => (
                <Badge
                  key={a}
                  label={`${animalEmojis[a] || "🐾"} ${a}`}
                  variant="animal"
                />
              ))}
            </div>
          )}
          {typedClinic.languages.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {typedClinic.languages.map((l) => (
                <Badge key={l} label={l} variant="language" />
              ))}
            </div>
          )}
        </div>

        {/* Description */}
        {typedClinic.description && (
          <section className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900">
              Sobre la clinica
            </h2>
            <p className="mt-2 leading-relaxed text-gray-600">
              {typedClinic.description}
            </p>
          </section>
        )}

        {/* Schedule + Contact grid */}
        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          {/* Schedule */}
          {Object.keys(hours).length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-gray-900">Horario</h2>
              <dl className="mt-2 space-y-1">
                {dayOrder.map((day) =>
                  hours[day] ? (
                    <div key={day} className="flex justify-between text-sm">
                      <dt className="text-gray-600">{day}</dt>
                      <dd className="text-gray-900">{hours[day]}</dd>
                    </div>
                  ) : null,
                )}
              </dl>
            </section>
          )}

          {/* Contact */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900">Contacto</h2>
            <ul className="mt-2 space-y-2 text-sm text-gray-600">
              {typedClinic.phone && (
                <li>
                  📞{" "}
                  <a
                    href={`tel:${typedClinic.phone}`}
                    className="text-teal-700 hover:underline"
                  >
                    {typedClinic.phone}
                  </a>
                </li>
              )}
              {typedClinic.email && (
                <li>
                  📧{" "}
                  <a
                    href={`mailto:${typedClinic.email}`}
                    className="text-teal-700 hover:underline"
                  >
                    {typedClinic.email}
                  </a>
                </li>
              )}
              {typedClinic.website && (
                <li>
                  🌐{" "}
                  <a
                    href={typedClinic.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-700 hover:underline"
                  >
                    {typedClinic.website}
                  </a>
                </li>
              )}
              <li>📍 {typedClinic.address}</li>
            </ul>
          </section>
        </div>

        {/* Map + Directions */}
        <ClinicDetailMap clinic={typedClinic} />

        {/* Reviews */}
        <ReviewList
          reviews={reviews as Awaited<ReturnType<typeof getReviews>>}
          averageRating={typedClinic.rating}
          totalCount={typedClinic.reviewCount}
        />

        {/* Related clinics */}
        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="text-lg font-semibold text-gray-900">
              Mas clinicas en {typedClinic.barrio}
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {(related as Clinic[]).map((c) => (
                <ClinicCard key={c.id} clinic={c} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
