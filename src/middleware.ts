import { NextRequest, NextResponse } from 'next/server'
import { verifyAuthFromRequest } from '@/src/lib/auth'

export function middleware(req: NextRequest) {
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
  const isLoginPage = req.nextUrl.pathname === '/admin/login'

  if (isAdminRoute && !isLoginPage) {
    const cookieToken = req.cookies.get("accessToken")?.value;
    console.log("Middleware cookie:", cookieToken ? "EXISTS" : "MISSING");
    
    const admin = verifyAuthFromRequest(req)
    console.log("Middleware auth:", admin ? "VALID" : "INVALID");
    
    if (!admin) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}