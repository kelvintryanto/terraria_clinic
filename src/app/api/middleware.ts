import {
  canAccessCMS,
  canDeleteEntities,
  canManageRoles,
} from '@/app/utils/auth';
import { verify } from '@/app/utils/jwt';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// Define the user type based on JWT payload
type User = {
  id: string;
  email: string;
  name: string;
  role: string;
};

export async function withAuth(
  request: NextRequest,
  handler: (req: NextRequest, user: User) => Promise<NextResponse>
) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }

  const user = await verify(token);
  if (!user) {
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    );
  }

  return handler(request, user as User);
}

export async function withCmsAccess(
  request: NextRequest,
  handler: (req: NextRequest, user: User) => Promise<NextResponse>
) {
  return withAuth(request, async (req, user) => {
    if (!canAccessCMS(user.role)) {
      return NextResponse.json(
        { error: 'Access denied. Admin privileges required' },
        { status: 403 }
      );
    }

    return handler(req, user);
  });
}

export async function withSuperAdminAccess(
  request: NextRequest,
  handler: (req: NextRequest, user: User) => Promise<NextResponse>
) {
  return withAuth(request, async (req, user) => {
    if (!canManageRoles(user.role)) {
      return NextResponse.json(
        { error: 'Access denied. Super admin privileges required' },
        { status: 403 }
      );
    }

    return handler(req, user);
  });
}

export async function withDeleteAccess(
  request: NextRequest,
  handler: (req: NextRequest, user: User) => Promise<NextResponse>
) {
  return withAuth(request, async (req, user) => {
    if (!canDeleteEntities(user.role)) {
      return NextResponse.json(
        { error: 'Access denied. Delete privileges required' },
        { status: 403 }
      );
    }

    return handler(req, user);
  });
}

export async function withResourceOwnership(
  request: NextRequest,
  resourceOwnerId: string,
  handler: (req: NextRequest, user: User) => Promise<NextResponse>
) {
  return withAuth(request, async (req, user) => {
    // Super admin can access any resource
    if (user.role === 'super_admin') {
      return handler(req, user);
    }

    // Admin can access but with limited capabilities (handled in the handler)
    if (user.role === 'admin') {
      return handler(req, user);
    }

    // Customers can only access their own resources
    if (user.role === 'Customer' && user.id === resourceOwnerId) {
      return handler(req, user);
    }

    return NextResponse.json(
      {
        error:
          'Access denied. You do not have permission to access this resource',
      },
      { status: 403 }
    );
  });
}
