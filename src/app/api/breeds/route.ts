import { getAllBreeds } from '@/app/models/breed';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const breeds = await getAllBreeds();
    return NextResponse.json(breeds);
  } catch (error) {
    console.error('Error fetching breeds:', error);
    return NextResponse.json(
      { error: 'Failed to fetch breeds' },
      { status: 500 }
    );
  }
}
