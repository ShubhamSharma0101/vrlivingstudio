import { PrismaPg } from "@prisma/adapter-pg";
// 1. Force the import directly from your custom generated folder layout
import { PrismaClient } from "../../generated/prisma"; 

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is missing.");
}

// 2. Initialize the base database client with the driver adapter instance
const basePrisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});

// 3. GLOBAL FIX: Extend the client to automatically transform Decimal to String
export const prisma = basePrisma.$extends({
  result: {
    product: {
      price: {
        needs: { price: true },
        compute(product: { price: { toString: () => string } }) {
          // FIXED: Explicitly typed the parameter to avoid implicit 'any'
          return product.price.toString();
        },
      },
    },
  },
});

// 4. Safely configure global singleton mapping using the exact type of our extended client
const globalForPrisma = globalThis as unknown as {
  prisma: typeof prisma | undefined;
};

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}