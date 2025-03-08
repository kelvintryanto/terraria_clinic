import { withAuth } from '@/app/api/middleware';
import redis from '@/app/config/redis';
import {
  getCustomerById,
  updateCustomer,
  updateDog,
} from '@/app/models/customer';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

// PUT: Update a dog's information (requires super_admin role)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; dogId: string }> }
) {
  return withAuth(request, async (req, user) => {
    // Only allow super_admin to update dogs
    if (user.role !== 'super_admin') {
      return NextResponse.json(
        {
          error:
            'Access denied. Super admin privileges required to update dogs.',
        },
        { status: 403 }
      );
    }

    try {
      const { id: customerId, dogId } = await params;
      const updatedDog = await request.json();

      // Convert breedId from string to ObjectId if it exists
      const processedDog = {
        ...updatedDog,
        breedId: updatedDog.breedId
          ? new ObjectId(updatedDog.breedId)
          : undefined,
      };

      await redis.del(`customer:${customerId}`);

      // Update the dog
      await updateDog(customerId, dogId, processedDog);

      // Fetch the updated customer data
      const updatedCustomer = await getCustomerById(customerId);
      if (!updatedCustomer) {
        return NextResponse.json(
          { error: 'Customer not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(updatedCustomer);
    } catch (error) {
      console.error('Error updating dog:', error);
      return NextResponse.json(
        { error: 'Failed to update dog' },
        { status: 500 }
      );
    }
  });
}

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

      await redis.del(`customer:${customerId}`);

      // Get customer
      const customer = await getCustomerById(customerId);
      if (!customer) {
        return NextResponse.json(
          { error: 'Customer not found' },
          { status: 404 }
        );
      }

      // Remove dog from customer's dogs array
      customer.dogs = customer.dogs.filter(
        (dog) => dog._id.toString() !== dogId
      );

      // Update customer
      await updateCustomer(customerId, { dogs: customer.dogs });

      // Fetch the updated customer to return
      const updatedCustomer = await getCustomerById(customerId);
      if (!updatedCustomer) {
        return NextResponse.json(
          { error: 'Failed to retrieve updated customer' },
          { status: 500 }
        );
      }

      return NextResponse.json(updatedCustomer);
    } catch (error) {
      console.error('Error deleting dog:', error);
      return NextResponse.json(
        { error: 'Failed to delete dog' },
        { status: 500 }
      );
    }
  });
}
