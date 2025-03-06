import redis from '@/app/config/redis';
import { createService, getAllServices } from '@/app/models/services';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const result = await getAllServices();

    const cachedServices = await redis.get('services');

    if (cachedServices) {
      return NextResponse.json(JSON.parse(cachedServices));
    }

    await redis.set('services', JSON.stringify(result));

    return NextResponse.json(result);
  } catch (error) {
    console.log('Error on fetching services', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await createService(body);

    await redis.del('services');

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.log('Error on creating service', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
