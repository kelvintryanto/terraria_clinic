import { removeDogFromCustomer } from '@/app/models/customer';
import { NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{
    id: string;
    dogId: string;
  }>;
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id, dogId } = await params;
    await removeDogFromCustomer(id, dogId);
    return NextResponse.json({ message: 'Dog removed successfully' });
  } catch (error) {
    console.error('Failed to remove dog:', error);
    return NextResponse.json(
      { error: 'Failed to remove dog' },
      { status: 500 }
    );
  }
}
