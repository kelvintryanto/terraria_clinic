import { createService, getAllServices } from '@/app/models/services';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const result = await getAllServices();
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
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.log('Error on creating service', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
