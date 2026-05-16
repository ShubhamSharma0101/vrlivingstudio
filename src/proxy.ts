import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

// Next.js 16 requires 'export default function proxy()' instead of 'middleware'
export default clerkMiddleware(async (auth, req) => {
  if (isAdminRoute(req)) {
    const session = await auth();

    // Protect the route if no user session exists
    if (!session.userId) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Read the role directly from Clerk Metadata (safe for Next.js Edge execution)
    const userRole = session.sessionClaims?.metadata?.role;

    if (userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
});

// Next.js 16 matching configuration template
export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};