import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const path = req.nextUrl.pathname;
  
  // Paths that are always accessible
  const publicPaths = ['/', '/login', '/register'];
  const isPublicPath = publicPaths.includes(path);
  
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET 
  });
  
  // Redirect unauthenticated users to login if they try to access protected routes
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  
  // Redirect authenticated users away from login/register pages
  if (token && (path === '/login' || path === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
  
  return NextResponse.next();
}

// Configure which paths the middleware runs on
export const config = {
  matcher: ['/', '/login', '/register', '/dashboard/:path*', '/settings/:path*'],
}; 