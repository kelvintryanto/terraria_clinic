import {
  Customer,
  deleteCustomer,
  getCustomerById,
  updateCustomer,
} from '@/app/models/customer';
import { NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const customer = await getCustomerById(id);
    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(customer);
  } catch (error: unknown) {
    console.error('Failed to fetch customer:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customer' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const result = await updateCustomer(id, body as Partial<Customer>);

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    // Fetch and return the updated customer
    const updatedCustomer = await getCustomerById(id);
    return NextResponse.json(updatedCustomer);
  } catch (error: unknown) {
    console.error('Failed to update customer:', error);
    return NextResponse.json(
      { error: 'Failed to update customer' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const result = await deleteCustomer(id);

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Customer deleted successfully' });
  } catch (error: unknown) {
    console.error('Failed to delete customer:', error);
    return NextResponse.json(
      { error: 'Failed to delete customer' },
      { status: 500 }
    );
  }
}
