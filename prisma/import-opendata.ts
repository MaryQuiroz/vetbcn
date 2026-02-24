/**
 * Importa datos reales de clínicas veterinarias desde Open Data Barcelona.
 * Dataset: "Llista d'equipaments d'animals i les plantes"
 * https://opendata-ajuntament.barcelona.cat/data/es/dataset/99360f4f-09bb-433a-9450-dddf79d7d2b8
 *
 * Uso: npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/import-opendata.ts
 */

import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// ─── CKAN API ────────────────────────────────────────────────────────────────

const RESOURCE_ID = "0b57a185-8986-4d0f-922f-da8415056575";
const CKAN_BASE = "https://opendata-ajuntament.barcelona.cat/data/api/3/action";

interface CKANRecord {
  register_id: string;
  name: string;
  addresses_roadtype_name: string;
  addresses_road_name: string;
  addresses_start_street_number: string | number;
  addresses_neighborhood_name: string;
  addresses_district_name: string;
  addresses_zip_code: string | number;
  geo_epgs_4326_lat: string | number | null;
  geo_epgs_4326_lon: string | number | null;
  values_attribute_name: string | null;
  values_value: string | null;
  end_date: string | null;
  [key: string]: unknown;
}

async function fetchAllVetRecords(): Promise<CKANRecord[]> {
  const records: CKANRecord[] = [];
  const limit = 100;
  let offset = 0;

  while (true) {
    const url =
      `${CKAN_BASE}/datastore_search` +
      `?resource_id=${RESOURCE_ID}` +
      `&q=veterinari` +
      `&limit=${limit}` +
      `&offset=${offset}`;

    console.log(`  Fetching offset=${offset}…`);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`CKAN API error: ${res.status}`);
    const json = (await res.json()) as {
      result: { records: CKANRecord[]; total: number };
    };

    const batch = json.result.records;
    records.push(...batch);

    if (records.length >= json.result.total || batch.length < limit) break;
    offset += limit;
  }

  return records;
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** Seeded pseudo-random (deterministic per clinic) */
function seededRandom(seed: string, min: number, max: number): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }
  const t = ((h >>> 0) / 0xffffffff);
  return min + t * (max - min);
}

function seededInt(seed: string, min: number, max: number): number {
  return Math.floor(seededRandom(seed, min, max + 1));
}

function detectIsEmergency(name: string): boolean {
  const n = name.toLowerCase();
  return n.includes("urgent") || n.includes("24h") || n.includes("hospital");
}

function detectSpecialties(name: string, isEmergency: boolean): string[] {
  const n = name.toLowerCase();
  const specs: string[] = [];

  if (n.includes("hospital") || isEmergency) specs.push("Cirugía");
  if (n.includes("dermatolog")) specs.push("Dermatología");
  if (n.includes("oftalmolog")) specs.push("Oftalmología");
  if (n.includes("odontolog") || n.includes("dental")) specs.push("Odontología");
  if (n.includes("cardiolog")) specs.push("Cardiología");
  if (n.includes("oncolog")) specs.push("Oncología");
  if (n.includes("radiolog") || n.includes("diagnos")) specs.push("Diagnóstico por imagen");
  if (n.includes("rehab") || n.includes("fisio")) specs.push("Rehabilitación");
  if (n.includes("nutric") || n.includes("dieteti")) specs.push("Nutrición");

  // Hospitals tend to have more specialties
  if (specs.length === 0 && n.includes("hospital")) {
    specs.push("Cirugía", "Diagnóstico por imagen");
  }

  // All clinics do preventive care
  specs.push("Medicina preventiva");

  return [...new Set(specs)];
}

function detectAnimalTypes(name: string): string[] {
  const n = name.toLowerCase();
  const types: string[] = [];

  if (n.includes("felin") || n.includes("gat") || n.includes("cat")) types.push("Gatos");
  if (n.includes("cani") || n.includes("gos") || n.includes("perr")) types.push("Perros");
  if (n.includes("exotic") || n.includes("exòtic") || n.includes("rèptil") || n.includes("reptil")) {
    types.push("Exoticos");
  }
  if (n.includes("av") || n.includes("ocell")) types.push("Aves");
  if (n.includes("conill") || n.includes("conejo")) types.push("Conejos");

  // Default: dogs and cats
  if (types.length === 0) {
    types.push("Perros", "Gatos");
  }

  return [...new Set(types)];
}

function generateHours(
  seed: string,
  isEmergency: boolean
): Record<string, string | null> {
  if (isEmergency) {
    // Emergency clinics open all week, longer hours
    return {
      monday: "8:00-22:00",
      tuesday: "8:00-22:00",
      wednesday: "8:00-22:00",
      thursday: "8:00-22:00",
      friday: "8:00-22:00",
      saturday: "9:00-21:00",
      sunday: "10:00-20:00",
    };
  }

  const openSat = seededRandom(seed + "sat", 0, 1) > 0.3;
  const openSun = seededRandom(seed + "sun", 0, 1) > 0.8;
  const lunchBreak = seededRandom(seed + "lunch", 0, 1) > 0.5;

  const morning = lunchBreak ? "9:00-13:30" : "9:00-20:00";
  const afternoon = lunchBreak ? "16:00-20:00" : null;

  const weekday = lunchBreak
    ? `${morning} / 16:00-20:00`
    : "9:00-20:00";

  return {
    monday: weekday,
    tuesday: weekday,
    wednesday: weekday,
    thursday: weekday,
    friday: weekday,
    saturday: openSat ? "9:00-13:30" : null,
    sunday: openSun ? "10:00-13:00" : null,
  };
}

function generateLanguages(seed: string): string[] {
  const langs = ["Catalán", "Castellano"];
  if (seededRandom(seed + "en", 0, 1) > 0.6) langs.push("Inglés");
  if (seededRandom(seed + "fr", 0, 1) > 0.85) langs.push("Francés");
  return langs;
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

interface ClinicRow {
  register_id: string;
  name: string;
  address: string;
  barrio: string;
  lat: number | null;
  lng: number | null;
  phone: string | null;
  active: boolean;
}

async function main() {
  console.log("⬇️  Fetching data from Open Data Barcelona…");
  const raw = await fetchAllVetRecords();
  console.log(`   ${raw.length} rows fetched`);

  // Group by register_id — each clinic has multiple rows (one per attribute)
  const grouped = new Map<string, CKANRecord[]>();
  for (const row of raw) {
    const rows = grouped.get(row.register_id) ?? [];
    rows.push(row);
    grouped.set(row.register_id, rows);
  }

  console.log(`   ${grouped.size} unique establishments`);

  // Build canonical clinic per group
  const clinics: ClinicRow[] = [];
  for (const [id, rows] of grouped) {
    const primary = rows[0];

    // Skip closed establishments
    if (primary.end_date) continue;

    // Skip if name doesn't actually relate to vet services
    const nameLower = primary.name.toLowerCase();
    if (
      !nameLower.includes("veterinari") &&
      !nameLower.includes("veterinary") &&
      !nameLower.includes("clínica vet") &&
      !nameLower.includes("clinica vet")
    ) {
      continue;
    }

    // Build address
    const roadType = primary.addresses_roadtype_name ?? "";
    const roadName = primary.addresses_road_name ?? "";
    const number = primary.addresses_start_street_number ?? "";
    const address = `${roadType} ${roadName}, ${number}`.trim();

    // Coordinates
    const lat = primary.geo_epgs_4326_lat
      ? parseFloat(String(primary.geo_epgs_4326_lat))
      : null;
    const lng = primary.geo_epgs_4326_lon
      ? parseFloat(String(primary.geo_epgs_4326_lon))
      : null;

    // Phone: look for the row with Tel. attribute
    const phoneRow = rows.find(
      (r) =>
        r.values_attribute_name?.toLowerCase().includes("tel") &&
        r.values_value
    );
    const rawPhone = phoneRow?.values_value ?? null;
    // Normalize phone: keep digits, format as XXX XXX XXX
    const phone = rawPhone
      ? rawPhone.replace(/\D/g, "").replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3")
      : null;

    const barrio = primary.addresses_neighborhood_name ?? primary.addresses_district_name ?? "Barcelona";

    clinics.push({ register_id: id, name: primary.name, address, barrio, lat, lng, phone, active: true });
  }

  console.log(`   ${clinics.length} active vet establishments`);

  // Track slugs for uniqueness
  const usedSlugs = new Set<string>();

  const data = clinics.map((c) => {
    const seed = c.register_id;
    const isEmergency = detectIsEmergency(c.name);

    let baseSlug = slugify(c.name);
    let slug = baseSlug;
    let suffix = 2;
    while (usedSlugs.has(slug)) {
      slug = `${baseSlug}-${suffix++}`;
    }
    usedSlugs.add(slug);

    const rating = Math.round(seededRandom(seed, 3.2, 5.0) * 10) / 10;
    const reviewCount = seededInt(seed + "rc", 8, 320);
    const price = seededInt(seed + "pr", 1, 3);

    return {
      slug,
      name: c.name,
      address: c.address,
      barrio: c.barrio,
      phone: c.phone ?? "900 000 000",
      email: null,
      website: null,
      description: null,
      imageUrl: null,
      hours: generateHours(seed, isEmergency),
      specialties: detectSpecialties(c.name, isEmergency),
      animalTypes: detectAnimalTypes(c.name),
      languages: generateLanguages(seed),
      rating,
      reviewCount,
      price,
      isEmergency,
      lat: c.lat,
      lng: c.lng,
    };
  });

  console.log("\n🗑️  Clearing existing clinics…");
  await prisma.clinic.deleteMany();

  console.log("💾 Inserting real data…");
  const result = await prisma.clinic.createMany({ data });

  console.log(`\n✅ Imported ${result.count} clinics from Open Data Barcelona`);

  // Summary by barrio
  const byBarrio: Record<string, number> = {};
  for (const d of data) {
    byBarrio[d.barrio] = (byBarrio[d.barrio] ?? 0) + 1;
  }
  const sorted = Object.entries(byBarrio).sort((a, b) => b[1] - a[1]);
  console.log("\nPor barrio:");
  for (const [barrio, count] of sorted) {
    console.log(`  ${barrio}: ${count}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
