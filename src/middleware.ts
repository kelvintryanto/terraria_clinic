import { canAccessCMS, getUserFromRequest } from '@/app/utils/auth';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token');

  // Check if the route is protected
  const isCmsRoute = request.nextUrl.pathname.startsWith('/cms');
  const isProfileRoute = request.nextUrl.pathname.startsWith('/profile');
  const isProtectedRoute = isCmsRoute || isProfileRoute;

  // If trying to access protected route without token, redirect to login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If trying to access CMS routes, check for admin/superadmin role
  if (isCmsRoute && token) {
    const user = await getUserFromRequest();

    if (!user || !canAccessCMS(user.role)) {
      // Redirect non-admin users trying to access CMS to homepage
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Allow all other routes to proceed
  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: ['/profile/:path*', '/cms/:path*'],
};
