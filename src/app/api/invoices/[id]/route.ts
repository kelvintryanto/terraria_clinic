import redis from '@/app/config/redis';
import { deleteInvoice, getInvoiceById } from '@/app/models/invoice';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const invoice = await getInvoiceById(id);

    const cachedInvoice = await redis.get(`invoice:${id}`);

    if (cachedInvoice) {
      return NextResponse.json(JSON.parse(cachedInvoice));
    }

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    await redis.set(`invoice:${id}`, JSON.stringify(invoice));

    return NextResponse.json(invoice);
  } catch (error) {
    console.error('Error on fetching invoice', error);
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
    await deleteInvoice(id);

    await redis.del(`invoice:${id}`);

    return NextResponse.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    console.error('Error on deleting invoice', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
