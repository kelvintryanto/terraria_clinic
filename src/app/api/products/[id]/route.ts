import redis from '@/app/config/redis';
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

    const cachedProduct = await redis.get(`product:${id}`);

    if (cachedProduct) {
      return NextResponse.json(JSON.parse(cachedProduct));
    }

    if (!product)
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });

    await redis.set(`product:${id}`, JSON.stringify(product));

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

  await redis.del(`product:${id}`);

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

  await redis.del(`product:${id}`);

  const body = await request.json();

  await updateProduct(id, body);

  return NextResponse.json(
    { message: 'Product updated successfully' },
    { status: 200 }
  );
}
