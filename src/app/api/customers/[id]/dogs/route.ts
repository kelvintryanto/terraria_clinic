import {
  addDogToCustomer,
  removeDogFromCustomer,
  updateDog,
} from '@/app/models/dog';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const result = await addDogToCustomer(id, body);
    return NextResponse.json(result, { status: 201 });
  } catch (error: unknown) {
    console.error('Failed to add dog:', error);
    return NextResponse.json({ error: 'Failed to add dog' }, { status: 500 });
  }
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
