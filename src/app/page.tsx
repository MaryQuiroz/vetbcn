import { Suspense } from "react";
import { getClinics } from "@/lib/clinics";
import type { ClinicsFilter } from "@/lib/clinics";
import type { Clinic } from "@/types/clinic";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import HomeContent from "@/components/HomeContent";

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;

  const filters: ClinicsFilter = {};

  if (typeof params.search === "string" && params.search) {
    filters.search = params.search;
  }
  if (typeof params.barrio === "string" && params.barrio) {
    filters.barrio = params.barrio;
  }
  if (typeof params.animal === "string" && params.animal) {
    filters.animalType = params.animal;
  }
  if (typeof params.rating === "string" && params.rating) {
    filters.minRating = parseFloat(params.rating);
  }
  if (typeof params.price === "string" && params.price) {
    filters.price = parseInt(params.price, 10);
  }
  if (params.emergency === "true") {
    filters.isEmergency = true;
  }

  const clinics = (await getClinics(filters)) as unknown as Clinic[];

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-b from-teal-50 to-white px-4 py-10 text-center sm:py-16">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
          Encuentra el mejor
          <br />
          <span className="text-teal-700">veterinario de Barcelona</span>
        </h1>
        <div className="mx-auto mt-6 flex justify-center">
          <Suspense fallback={<div className="h-12 w-full max-w-2xl animate-pulse rounded-lg bg-gray-200" />}>
            <SearchBar />
          </Suspense>
        </div>
      </section>

      {/* Main content */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <HomeContent clinics={clinics} />
      </main>

      <Footer />
    </div>
  );
}
