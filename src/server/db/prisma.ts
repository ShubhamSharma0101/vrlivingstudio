import { PrismaPg } from "@prisma/adapter-pg";
// 1. Force the import directly from your custom generated folder layout
import { PrismaClient } from "../../generated/prisma"; 

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is missing.");
}

// 2. Safely configure global type mapping to maintain singletons across hot-reloads
const globalForPrisma = globalThis as unknown as {
  prisma: InstanceType<typeof PrismaClient> | undefined;
};

// 3. Initialize the database client with the driver adapter instance
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}