import { getUserFromRequest } from '@/app/api/auth/server-auth';
import {
  canAccessCMS,
  canCreateCategory,
  canCreateCustomer,
  canCreateProduct,
  canDeleteCategory,
  canDeleteCustomer,
  canDeleteEntities,
  canDeleteEntity,
  canDeleteProduct,
  canEditCategory,
  canEditCustomer,
  canEditEntity,
  canEditProduct,
} from '@/app/utils/server-auth-utils';
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
  try {
    const user = await getUserFromRequest();

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    return handler(request, user as User);
  } catch (error) {
    console.error('Auth middleware error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    );
  }
}

export async function withCmsAccess(
  request: NextRequest,
  handler: (req: NextRequest, user: User) => Promise<NextResponse>
) {
  return withAuth(request, async (req, user) => {
    if (!canAccessCMS(user.role)) {
      return NextResponse.json(
        { error: 'Access denied. CMS access required' },
        { status: 403 }
      );
    }

    return handler(req, user);
  });
}

// Customer middleware
export async function withCreateCustomerAccess(
  request: NextRequest,
  handler: (req: NextRequest, user: User) => Promise<NextResponse>
) {
  return withAuth(request, async (req, user) => {
    if (!canCreateCustomer(user.role)) {
      return NextResponse.json(
        { error: 'Access denied. Create customer privileges required' },
        { status: 403 }
      );
    }

    return handler(req, user);
  });
}

export async function withEditCustomerAccess(
  request: NextRequest,
  handler: (req: NextRequest, user: User) => Promise<NextResponse>
) {
  return withAuth(request, async (req, user) => {
    if (!canEditCustomer(user.role)) {
      return NextResponse.json(
        { error: 'Access denied. Edit customer privileges required' },
        { status: 403 }
      );
    }

    return handler(req, user);
  });
}

export async function withDeleteCustomerAccess(
  request: NextRequest,
  handler: (req: NextRequest, user: User) => Promise<NextResponse>
) {
  return withAuth(request, async (req, user) => {
    if (!canDeleteCustomer(user.role)) {
      return NextResponse.json(
        { error: 'Access denied. Delete customer privileges required' },
        { status: 403 }
      );
    }

    return handler(req, user);
  });
}

// Product middleware
export async function withCreateProductAccess(
  request: NextRequest,
  handler: (req: NextRequest, user: User) => Promise<NextResponse>
) {
  return withAuth(request, async (req, user) => {
    if (!canCreateProduct(user.role)) {
      return NextResponse.json(
        { error: 'Access denied. Create product privileges required' },
        { status: 403 }
      );
    }

    return handler(req, user);
  });
}

export async function withEditProductAccess(
  request: NextRequest,
  handler: (req: NextRequest, user: User) => Promise<NextResponse>
) {
  return withAuth(request, async (req, user) => {
    if (!canEditProduct(user.role)) {
      return NextResponse.json(
        { error: 'Access denied. Edit product privileges required' },
        { status: 403 }
      );
    }

    return handler(req, user);
  });
}

export async function withDeleteProductAccess(
  request: NextRequest,
  handler: (req: NextRequest, user: User) => Promise<NextResponse>
) {
  return withAuth(request, async (req, user) => {
    if (!canDeleteProduct(user.role)) {
      return NextResponse.json(
        { error: 'Access denied. Delete product privileges required' },
        { status: 403 }
      );
    }

    return handler(req, user);
  });
}

// Category middleware
export async function withCreateCategoryAccess(
  request: NextRequest,
  handler: (req: NextRequest, user: User) => Promise<NextResponse>
) {
  return withAuth(request, async (req, user) => {
    if (!canCreateCategory(user.role)) {
      return NextResponse.json(
        { error: 'Access denied. Create category privileges required' },
        { status: 403 }
      );
    }

    return handler(req, user);
  });
}

export async function withEditCategoryAccess(
  request: NextRequest,
  handler: (req: NextRequest, user: User) => Promise<NextResponse>
) {
  return withAuth(request, async (req, user) => {
    if (!canEditCategory(user.role)) {
      return NextResponse.json(
        { error: 'Access denied. Edit category privileges required' },
        { status: 403 }
      );
    }

    return handler(req, user);
  });
}

export async function withDeleteCategoryAccess(
  request: NextRequest,
  handler: (req: NextRequest, user: User) => Promise<NextResponse>
) {
  return withAuth(request, async (req, user) => {
    if (!canDeleteCategory(user.role)) {
      return NextResponse.json(
        { error: 'Access denied. Delete category privileges required' },
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
    if (!canDeleteEntities(user.role)) {
      return NextResponse.json(
        { error: 'Access denied. Super admin privileges required' },
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
    if (!canEditEntity(user.role, user.id, resourceOwnerId)) {
      return NextResponse.json(
        {
          error:
            'Access denied. You do not have permission to access this resource',
        },
        { status: 403 }
      );
    }

    return handler(req, user);
  });
}

export async function withDeleteAccess(
  request: NextRequest,
  resourceOwnerId: string,
  handler: (req: NextRequest, user: User) => Promise<NextResponse>
) {
  return withAuth(request, async (req, user) => {
    if (!canDeleteEntity(user.role, user.id, resourceOwnerId)) {
      return NextResponse.json(
        {
          error:
            'Access denied. You do not have permission to delete this resource',
        },
        { status: 403 }
      );
    }

    return handler(req, user);
  });
}
