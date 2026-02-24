import { NextRequest, NextResponse } from "next/server";
import { getClinicBySlug, getRelatedClinics } from "@/lib/clinics";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const clinic = await getClinicBySlug(slug);

  if (!clinic) {
    return NextResponse.json({ error: "Clinic not found" }, { status: 404 });
  }

  const related = await getRelatedClinics(clinic.barrio, clinic.id);

  return NextResponse.json({ clinic, related });
}
