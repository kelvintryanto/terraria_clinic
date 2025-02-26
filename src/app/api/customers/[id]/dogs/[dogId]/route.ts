import { withAuth } from '@/app/api/middleware';
import { getCustomerById, removeDogFromCustomer } from '@/app/models/customer';
import { NextRequest, NextResponse } from 'next/server';

// DELETE: Remove a dog from a customer (requires super_admin role)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; dogId: string }> }
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
      const { id: customerId, dogId } = await params;

      // Remove the dog
      await removeDogFromCustomer(customerId, dogId);

      // Fetch the updated customer data
      const customer = await getCustomerById(customerId);
      if (!customer) {
        return NextResponse.json(
          { error: 'Customer not found' },
          { status: 404 }
        );
      }

      // Convert ObjectIds to strings in the response
      const responseCustomer = {
        ...customer,
        _id: customer._id.toString(),
        dogs: customer.dogs.map((dog) => ({
          ...dog,
          _id: dog._id.toString(),
          breedId: dog.breedId?.toString() || null,
        })),
      };

      return NextResponse.json(responseCustomer);
    } catch (error) {
      console.error('Error removing dog from customer:', error);
      return NextResponse.json(
        { error: 'Failed to remove dog from customer' },
        { status: 500 }
      );
    }
  });
}
