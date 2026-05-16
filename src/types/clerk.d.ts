import { Roles } from "@/types/globals"; // Or just define the literal string types below

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: "ADMIN" | "USER" | "STAFF"; // 🚀 Add your role values here
    };
  }
}