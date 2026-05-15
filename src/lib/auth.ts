import { auth, currentUser } from "@clerk/nextjs/server";
// FIXED: Using an explicit relative path to your exact db configuration file
import { prisma } from "../server/db/prisma"; 

export async function getCurrentUser() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }
 
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return null;
  }

  const email = clerkUser.emailAddresses[0]?.emailAddress;

  if (!email) {
    return null;
  }

  // Double-check fallback configuration to avoid runtime undefined errors
  if (!prisma || !prisma.user) {
    console.error("Database connection failure: prisma.user is undefined.");
    return null;
  }

  const dbUser = await prisma.user.upsert({
    where: {
      clerkId: userId,
    },
    update: {
      email,
      name: clerkUser.fullName,
    },
    create: {
      clerkId: userId,
      email,
      name: clerkUser.fullName,
    },
  });

  return dbUser;
}