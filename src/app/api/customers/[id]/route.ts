import {
  withDeleteCustomerAccess,
  withEditCustomerAccess,
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
  try {
    const { id } = await params;
    const customer = await getCustomerById(id);

    const cachedCustomer = await redis.get(`customer:${id}`);

    if (cachedCustomer) {
      return NextResponse.json(JSON.parse(cachedCustomer));
    }

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    await redis.set(`customer:${id}`, JSON.stringify(customer));

    return NextResponse.json(customer);
  } catch (error) {
    console.error('Error fetching customer:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customer' },
      { status: 500 }
    );
  }
}

// PUT: Update a customer (requires CMS access - admin or super_admin)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withEditCustomerAccess(request, async () => {
    try {
      const { id } = await params;
      const data = await request.json();

      await redis.del(`customer:${id}`);
      await redis.del('customers');

      const result = await updateCustomer(id, data);
      return NextResponse.json(result);
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
  return withDeleteCustomerAccess(request, async () => {
    try {
      const { id } = await params;
      await deleteCustomer(id);

      await redis.del(`customer:${id}`);
      await redis.del('customers');

      return NextResponse.json({ message: 'Customer deleted successfully' });
    } catch (error) {
      console.error('Error deleting customer:', error);
      return NextResponse.json(
        { error: 'Failed to delete customer' },
        { status: 500 }
      );
    }
  });
}
