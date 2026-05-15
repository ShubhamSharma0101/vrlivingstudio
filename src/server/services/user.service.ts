import { prisma } from "@/server/db/prisma";

type SyncUserInput = {
  clerkId: string;
  email: string;
  name?: string | null;
};

export async function syncUser(input: SyncUserInput) {
  return prisma.user.upsert({
    where: {
      clerkId: input.clerkId,
    },
    update: {
      email: input.email,
      name: input.name,
    },
    create: {
      clerkId: input.clerkId,
      email: input.email,
      name: input.name,
    },
  });
}