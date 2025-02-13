import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token");
  const isProtectedRoute = request.nextUrl.pathname.startsWith("/profile") || request.nextUrl.pathname.startsWith("/cms");
  const isPublicRoute = request.nextUrl.pathname === "/" || request.nextUrl.pathname.startsWith("/about");

  // If trying to access protected route without token, redirect to login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If trying to access public route without token, redirect to login
  if (isPublicRoute && !token) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login
     * - register
     */
    "/((?!api|_next/static|_next/image|favicon.ico|login|register).*)",
  ],
};
