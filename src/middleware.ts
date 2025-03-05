import { getUserFromRequest } from '@/app/api/auth/server-auth';
import { canAccessCMS } from '@/app/utils/server-auth-utils';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Only apply middleware to CMS routes
  if (!path.startsWith('/cms')) {
    return NextResponse.next();
  }

  try {
    const user = await getUserFromRequest();
    console.log('Middleware - User:', user);

    // No user found, redirect to login
    if (!user) {
      console.log('Middleware - No user found');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Check if user has CMS access
    const hasAccess = canAccessCMS(user.role);
    console.log('Middleware - Role:', user.role, 'Has Access:', hasAccess);

    // If no access, redirect to home
    if (!hasAccess) {
      console.log('Middleware - Access denied');
      return NextResponse.redirect(new URL('/', request.url));
    }

    // User has access, allow request to proceed
    console.log('Middleware - Access granted');
    const response = NextResponse.next();
    return response;
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

// Configure which routes to run middleware on
export const config = {
  matcher: ['/cms/:path*'],
};
