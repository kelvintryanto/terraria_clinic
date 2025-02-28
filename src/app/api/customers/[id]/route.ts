import {
  withAuth,
  withCmsAccess,
  withDeleteAccess,
} from '@/app/api/middleware';
import redis from '@/app/config/redis';
import {
  deleteCustomer,
  getCustomerById,
  updateCustomer,
} from '@/app/models/customer';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(request, async () => {
    try {
      const customerId = (await params).id;
      const customer = await getCustomerById(customerId);

      const cachedCustomer = await redis.get(`customer:${customerId}`);

      if (cachedCustomer) {
        return NextResponse.json(JSON.parse(cachedCustomer));
      }

      if (!customer) {
        return NextResponse.json(
          { error: 'Customer not found' },
          { status: 404 }
        );
      }

      await redis.set(`customer:${customerId}`, JSON.stringify(customer));

      return NextResponse.json(customer);
    } catch (error) {
      console.error('Error fetching customer:', error);
      return NextResponse.json(
        { error: 'Failed to fetch customer' },
        { status: 500 }
      );
    }
  });
}

// PUT: Update a customer (requires CMS access - admin or super_admin)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withCmsAccess(request, async () => {
    try {
      const customerId = (await params).id;
      const body = await request.json();

      // Validate required fields
      if (!body.name || !body.email || !body.phone || !body.address) {
        return NextResponse.json(
          { error: 'Name, email, phone, and address are required' },
          { status: 400 }
        );
      }

      await redis.del(`customer:${customerId}`);

      // Don't allow updating dogs through this endpoint
      delete body.dogs;

      await updateCustomer(customerId, body);

      // Get updated customer
      const updatedCustomer = await getCustomerById(customerId);

      return NextResponse.json(updatedCustomer);
    } catch (error) {
      console.error('Error updating customer:', error);
      return NextResponse.json(
        { error: 'Failed to update customer' },
        { status: 500 }
      );
    }
  });
}

// DELETE: Delete a customer (requires delete access - super_admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withDeleteAccess(request, async () => {
    try {
      const customerId = (await params).id;
      await deleteCustomer(customerId);

      return NextResponse.json({
        success: true,
        message: 'Customer deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting customer:', error);
      return NextResponse.json(
        { error: 'Failed to delete customer' },
        { status: 500 }
      );
    }
  });
}
