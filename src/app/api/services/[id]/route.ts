import {
  deleteService,
  getServiceById,
  updateService,
} from '@/app/models/services';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const service = await getServiceById(id);

    if (!service)
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });

    return NextResponse.json(service);
  } catch (error) {
    console.log('Error on fetching service', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
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
    const body = await request.json();

    const result = await updateService(id, body);
    return NextResponse.json(result);
  } catch (error) {
    console.log('Error on updating service', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
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
    const result = await deleteService(id);
    return NextResponse.json(result);
  } catch (error) {
    console.log('Error on deleting service', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
