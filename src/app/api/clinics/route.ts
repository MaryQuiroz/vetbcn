import { NextRequest, NextResponse } from "next/server";
import { getClinics } from "@/lib/clinics";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const filters = {
    barrio: searchParams.get("barrio") || undefined,
    animalType: searchParams.get("animalType") || undefined,
    specialty: searchParams.get("specialty") || undefined,
    minRating: searchParams.get("minRating")
      ? parseFloat(searchParams.get("minRating")!)
      : undefined,
    price: searchParams.get("price")
      ? parseInt(searchParams.get("price")!)
      : undefined,
    isEmergency:
      searchParams.get("isEmergency") === "true" ? true : undefined,
    search: searchParams.get("search") || undefined,
    sort: (searchParams.get("sort") as "rating" | "name") || undefined,
  };

  const clinics = await getClinics(filters);
  return NextResponse.json(clinics);
}
