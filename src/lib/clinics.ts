import { prisma } from "@/lib/db";
import { Prisma } from "@/generated/prisma/client";

export interface ClinicsFilter {
  barrio?: string;
  animalType?: string;
  specialty?: string;
  minRating?: number;
  price?: number;
  isEmergency?: boolean;
  search?: string;
  sort?: "rating" | "name";
}

export async function getClinics(filters: ClinicsFilter = {}) {
  const where: Prisma.ClinicWhereInput = {};

  if (filters.barrio) {
    where.barrio = filters.barrio;
  }

  if (filters.animalType) {
    where.animalTypes = { has: filters.animalType };
  }

  if (filters.specialty) {
    where.specialties = { has: filters.specialty };
  }

  if (filters.minRating) {
    where.rating = { gte: filters.minRating };
  }

  if (filters.price) {
    where.price = filters.price;
  }

  if (filters.isEmergency !== undefined) {
    where.isEmergency = filters.isEmergency;
  }

  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  const orderBy: Prisma.ClinicOrderByWithRelationInput =
    filters.sort === "name" ? { name: "asc" } : { rating: "desc" };

  return prisma.clinic.findMany({ where, orderBy });
}

export async function getClinicBySlug(slug: string) {
  return prisma.clinic.findUnique({ where: { slug } });
}

export async function getRelatedClinics(barrio: string, excludeId: string) {
  return prisma.clinic.findMany({
    where: {
      barrio,
      id: { not: excludeId },
    },
    orderBy: { rating: "desc" },
    take: 3,
  });
}

export async function getReviews(clinicId: string) {
  return prisma.review.findMany({
    where: { clinicId },
    orderBy: [{ helpful: "desc" }, { date: "desc" }],
    take: 20,
  });
}
