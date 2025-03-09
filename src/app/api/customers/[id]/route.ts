import { getUserFromRequest } from '@/app/api/auth/server-auth';
import { withEditCustomerAccess } from '@/app/api/middleware';
import redis from '@/app/config/redis';
import { deleteCustomer, updateCustomer } from '@/app/models/customer';
import { getDb } from '@/app/models/user';
import { canDeleteCustomer } from '@/app/utils/server-auth-utils';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get user from token for authentication
    const user = await getUserFromRequest();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 400 }
      );
    }

    // Try to get from cache first, unless cache-control: no-cache header is present
    const skipCache = request.headers
      .get('Cache-Control')
      ?.includes('no-cache');
    if (!skipCache) {
      const cachedCustomer = await redis.get(`customer:${id}`);
      if (cachedCustomer) {
        return NextResponse.json(JSON.parse(cachedCustomer));
      }
    }

    const db = await getDb();
    const customersCollection = db.collection('customers');

    // Try to find by ObjectId first
    let customer;
    try {
      customer = await customersCollection.findOne({ _id: new ObjectId(id) });
    } catch {
      // If not a valid ObjectId, try with the string ID
      customer = await customersCollection.findOne({ id: id });
    }

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    // Ensure dogs array exists
    if (!customer.dogs || !Array.isArray(customer.dogs)) {
      customer.dogs = [];
    }

    // Cache the result unless explicitly requested not to
    if (!skipCache) {
      await redis.set(`customer:${id}`, JSON.stringify({ customer }));
    }

    return NextResponse.json({ customer }, { status: 200 });
  } catch (error) {
    console.error('Error retrieving customer:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve customer' },
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

// DELETE: Delete a customer (requires super_admin or customer deleting their own account)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromRequest();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Allow deletion if user is super_admin OR if the user is deleting their own account
    if (!canDeleteCustomer(user.role) && user.id !== id) {
      return NextResponse.json(
        {
          error:
            'Access denied. You can only delete your own account or must be a super admin.',
        },
        { status: 403 }
      );
    }

    await deleteCustomer(id);

    // Clear customer caches
    await redis.del(`customer:${id}`);
    await redis.del('customers');

    // Clear diagnoses and invoices caches as they might contain data related to this customer
    await redis.del('diagnoses');
    await redis.del('invoices');

    return NextResponse.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Error deleting customer:', error);
    return NextResponse.json(
      { error: 'Failed to delete customer' },
      { status: 500 }
    );
  }
}
