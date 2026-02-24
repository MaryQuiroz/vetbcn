import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  return new PrismaClient({ adapter });
}

// In dev, invalidate the cached instance if the schema changed (e.g. new models added).
// "review" is used as a canary: if it's missing the cached client is stale.
const cached = globalForPrisma.prisma;
const needsFresh = cached && !("review" in cached);
export const prisma = needsFresh || !cached ? createPrismaClient() : cached;

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
