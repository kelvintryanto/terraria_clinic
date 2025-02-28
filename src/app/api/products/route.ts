import redis from '@/app/config/redis';
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
} from '@/app/models/products';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const result = await getAllProducts();

    const cachedProducts = await redis.get('products');

    if (cachedProducts) {
      return NextResponse.json(JSON.parse(cachedProducts));
    }

    await redis.set('products', JSON.stringify(result));

    return NextResponse.json(result);
  } catch (error) {
    console.log('Error on fetching products', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await createProduct(body);

    await redis.del('products');

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.log('Error on creating products', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    await redis.del(`product:${id}`);

    const body = await request.json();
    const result = await updateProduct(id, body);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error && error.message === 'Product not found') {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    await redis.del(`product:${id}`);

    const result = await deleteProduct(id);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error && error.message === 'Product not found') {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
