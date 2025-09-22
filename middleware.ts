import { authMiddleware, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export default authMiddleware({
  publicRoutes: ['/', '/sign-in(.*)', '/sign-up(.*)'],
  async afterAuth(auth, req) {
    if (auth.isPublicRoute) {
      return NextResponse.next()
    }

    const url = new URL(req.nextUrl.toString())

    if (url.pathname === '/create-organization') {
      return NextResponse.next()
    }

    const orgs = await clerkClient.users.getOrganizationMembershipList({
      userId: auth.userId as string,
    })

    if (!auth.orgId && !auth.isPublicRoute && orgs.length > 0) {
      const org = orgs[0].organization
      const newUrl = new URL(`/tasks`, req.url)
      return NextResponse.redirect(newUrl)
    }

    if (!auth.orgId && url.pathname !== '/create-organization') {
      const newUrl = new URL('/create-organization', req.url)
      return NextResponse.redirect(newUrl)
    }

    return NextResponse.next()
  },
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}