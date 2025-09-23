import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/",
  "/api/clerk-webhook",
]);

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/workspace(.*)"]);

export default clerkMiddleware((auth, req) => {
  const { userId, orgId, redirectToSignIn } = auth();

  if (!userId && isProtectedRoute(req)) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  // If the user is signed in and on a public route, redirect to dashboard
  if (userId && !isProtectedRoute(req) && !isPublicRoute(req)) {
    let path = "/dashboard";
    if (orgId) {
      path = `/workspace/${orgId}`;
    }
    const orgSelection = new URL(path, req.url);
    return NextResponse.redirect(orgSelection);
  }

  // If the user is signed in and has no organization, redirect to the dashboard to create one
  if (userId && !orgId && req.nextUrl.pathname !== "/dashboard") {
    const orgSelection = new URL("/dashboard", req.url);
    return NextResponse.redirect(orgSelection);
  }

  // If the user is on an org page but is not part of that org, redirect to the dashboard
  if (userId && orgId && isProtectedRoute(req) && !req.nextUrl.pathname.startsWith(`/workspace/${orgId}`)) {
    const path = `/workspace/${orgId}`;
    const orgSelection = new URL(path, req.url);
    return NextResponse.redirect(orgSelection);
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};