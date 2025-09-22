import { authMiddleware } from '@clerk/nextjs'
import { clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export default authMiddleware({
  publicRoutes: ['/', '/sign-in(.*)', '/sign-up(.*)', '/dashboard'],
  async afterAuth(auth, req) {
    if (auth.isPublicRoute) {
      return NextResponse.next()
    }

    const url = new URL(req.nextUrl.toString())

    if (url.pathname === '/create-organization') {
      return NextResponse.next()
    }

    if (auth.userId && url.pathname === '/') {
      const newUrl = new URL('/dashboard', req.url)
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