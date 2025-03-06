import redis from '@/app/config/redis';
import { getAllBreeds } from '@/app/models/breed';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const breeds = await getAllBreeds();

    const cachedBreeds = await redis.get('breeds');

    if (cachedBreeds) {
      return NextResponse.json(JSON.parse(cachedBreeds));
    }

    return NextResponse.json(breeds);
  } catch (error) {
    console.error('Error fetching breeds:', error);
    return NextResponse.json(
      { error: 'Failed to fetch breeds' },
      { status: 500 }
    );
  }
}
