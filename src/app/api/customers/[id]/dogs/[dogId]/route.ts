import { withAuth } from '@/app/api/middleware';
import redis from '@/app/config/redis';
import {
  getCustomerById,
  removeDogFromCustomer,
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
