import { withCmsAccess } from '@/app/api/middleware';
import {
  addDogToCustomer,
  removeDogFromCustomer,
  updateDog,
} from '@/app/models/dog';
import { NextRequest, NextResponse } from 'next/server';

// POST: Add a dog to a customer (requires CMS access - admin or super_admin)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withCmsAccess(request, async () => {
    try {
      const customerId = (await params).id;
      const body = await request.json();

      // Validate required fields
      if (!body.name || !body.breed || body.age === undefined || !body.color) {
        return NextResponse.json(
          { error: 'Name, breed, age, and color are required' },
          { status: 400 }
        );
      }

      // Ensure age is a number
      if (typeof body.age !== 'number') {
        body.age = parseInt(body.age);
        if (isNaN(body.age)) {
          return NextResponse.json(
            { error: 'Age must be a number' },
            { status: 400 }
          );
        }
      }

      const newDog = await addDogToCustomer(customerId, {
        name: body.name,
        breed: body.breed,
        age: body.age,
        color: body.color,
      });

      return NextResponse.json(newDog);
    } catch (error) {
      console.error('Error adding dog to customer:', error);
      return NextResponse.json(
        { error: 'Failed to add dog to customer' },
        { status: 500 }
      );
    }
  });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { dogId, ...dogData } = body;
    const result = await updateDog(id, dogId, dogData);
    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error('Failed to update dog:', error);
    return NextResponse.json(
      { error: 'Failed to update dog' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const dogId = searchParams.get('dogId');

    if (!dogId) {
      return NextResponse.json(
        { error: 'Dog ID is required' },
        { status: 400 }
      );
    }

    const result = await removeDogFromCustomer(id, dogId);
    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error('Failed to remove dog:', error);
    return NextResponse.json(
      { error: 'Failed to remove dog' },
      { status: 500 }
    );
  }
}
