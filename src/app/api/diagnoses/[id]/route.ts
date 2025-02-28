import redis from '@/app/config/redis';
import {
  deleteDiagnose,
  getDiagnoseById,
  updateDiagnose,
} from '@/app/models/diagnose';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const diagnose = await getDiagnoseById(id);

    const cachedDiagnose = await redis.get(`diagnose:${id}`);

    if (cachedDiagnose) {
      return NextResponse.json(JSON.parse(cachedDiagnose));
    }

    if (!diagnose) {
      return NextResponse.json(
        { error: 'Diagnose not found' },
        { status: 404 }
      );
    }

    await redis.set(`diagnose:${id}`, JSON.stringify(diagnose));

    return NextResponse.json(diagnose);
  } catch (error) {
    console.error('Error fetching diagnose:', error);
    return NextResponse.json(
      { error: 'Failed to fetch diagnose' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    await redis.del(`diagnose:${id}`);

    const result = await updateDiagnose(id, data);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating diagnose:', error);
    return NextResponse.json(
      { error: 'Failed to update diagnose' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await deleteDiagnose(id);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error deleting diagnose:', error);
    return NextResponse.json(
      { error: 'Failed to delete diagnose' },
      { status: 500 }
    );
  }
}
