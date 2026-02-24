import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const authors = [
  "Maria G.", "Joan P.", "Carlos M.", "Anna T.", "Pep S.", "Laura F.", "Miguel R.",
  "Marta C.", "David L.", "Sandra B.", "Jordi V.", "Elena M.", "Pablo N.", "Núria R.",
  "Alejandro S.", "Cristina P.", "Marc T.", "Isabel D.", "Fernando G.", "Laia O.",
];

const positiveComments = [
  "Atención excelente. El veterinario explicó cada detalle del diagnóstico con mucha paciencia.",
  "El personal es increíblemente amable. Mi gato siempre sale feliz de aquí.",
  "Profesionales de primera. Operaron a mi perro con éxito y el seguimiento fue impecable.",
  "Molt bon tracte. La veterinària és molt professional i es nota que estima els animals.",
  "Instalaciones muy limpias y modernas. El tiempo de espera fue mínimo.",
];

const mediumComments = [
  "Buena atención pero el tiempo de espera fue largo. Recomendable pero hay que tener paciencia.",
  "El veterinario fue muy competente aunque el precio es algo elevado para revisiones básicas.",
  "Correctos y profesionales. Nada extraordinario pero cumplen bien.",
  "Bien en general. A veces es difícil conseguir cita.",
];

const negativeComments = [
  "El tiempo de espera fue excesivo y nadie explicó los pasos a seguir.",
  "Precios muy altos para el servicio que ofrecen. Buscaré alternativas.",
];

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(): Date {
  const now = Date.now();
  const eighteenMonthsAgo = now - 18 * 30 * 24 * 60 * 60 * 1000;
  return new Date(eighteenMonthsAgo + Math.random() * (now - eighteenMonthsAgo));
}

function generateRating(clinicRating: number): number {
  const r = Math.random();
  if (clinicRating >= 4.5) {
    return r < 0.65 ? 5 : 4;
  } else if (clinicRating >= 3.5) {
    if (r < 0.3) return 5;
    if (r < 0.6) return 4;
    return 3;
  } else {
    if (r < 0.3) return 4;
    if (r < 0.7) return 3;
    return 2;
  }
}

function commentForRating(rating: number): string {
  if (rating >= 5) return pick(positiveComments);
  if (rating >= 3) return pick(mediumComments);
  return pick(negativeComments);
}

async function main() {
  const clinics = await prisma.clinic.findMany();
  console.log(`Found ${clinics.length} clinics. Seeding reviews...`);

  let totalCreated = 0;

  for (const clinic of clinics) {
    const count = randomInt(4, 12);
    const reviews = [];

    for (let i = 0; i < count; i++) {
      const rating = generateRating(clinic.rating);
      reviews.push({
        clinicId: clinic.id,
        author: pick(authors),
        rating,
        comment: commentForRating(rating),
        date: randomDate(),
        helpful: randomInt(0, 15),
      });
    }

    await prisma.review.createMany({ data: reviews });
    totalCreated += count;
    console.log(`  ${clinic.name}: ${count} reviews`);
  }

  console.log(`Done. Created ${totalCreated} reviews total.`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
