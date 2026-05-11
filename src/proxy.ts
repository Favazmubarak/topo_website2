import { NextRequest, NextResponse } from 'next/server'
import { verifyAuthFromRequest } from '@/src/lib/auth'

export default function proxy(req: NextRequest) {
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
  const isLoginPage = req.nextUrl.pathname === '/admin/login'

  if (isAdminRoute && !isLoginPage) {
    const admin = verifyAuthFromRequest(req)
    if (!admin) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}