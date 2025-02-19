import {
  deleteProduct,
  getProductById,
  updateProduct,
} from '@/app/models/products';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = await getProductById(id);

    if (!product)
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });

    return NextResponse.json(product);
  } catch (error) {
    console.log('Error on fetching products', error);
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
  const { id } = await params;

  const product = await getProductById(id);

  if (!product)
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });

  await deleteProduct(id);

  return NextResponse.json(
    { message: 'Product deleted successfully' },
    { status: 200 }
  );
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const product = await getProductById(id);

  if (!product)
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });

  const body = await request.json();

  await updateProduct(id, body);

  return NextResponse.json(
    { message: 'Product updated successfully' },
    { status: 200 }
  );
}
