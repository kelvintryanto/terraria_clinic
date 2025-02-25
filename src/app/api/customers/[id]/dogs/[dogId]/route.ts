import { withAuth } from '@/app/api/middleware';
import { removeDogFromCustomer } from '@/app/models/customer';
import { NextRequest, NextResponse } from 'next/server';

// DELETE: Remove a dog from a customer (requires super_admin role)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; dogId: string } }
) {
  return withAuth(request, async (req, user) => {
    // Only allow super_admin to delete dogs
    if (user.role !== 'super_admin') {
      return NextResponse.json(
        {
          error:
            'Access denied. Super admin privileges required to delete dogs.',
        },
        { status: 403 }
      );
    }

    try {
      const { id: customerId, dogId } = params;

      await removeDogFromCustomer(customerId, dogId);

      return NextResponse.json({
        success: true,
        message: 'Dog removed successfully',
      });
    } catch (error) {
      console.error('Error removing dog from customer:', error);
      return NextResponse.json(
        { error: 'Failed to remove dog from customer' },
        { status: 500 }
      );
    }
  });
}
