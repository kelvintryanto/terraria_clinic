import {
  createInvoice,
  getAllInvoices,
  getInvoicesByDate,
} from '@/app/models/invoice';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const invoices = await getAllInvoices();
    return NextResponse.json(invoices);
  } catch (error) {
    console.error('Error on getting invoice data', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Get current date components
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    // Get invoices for today to determine the sequence number
    const todayInvoices = await getInvoicesByDate(now);
    const sequenceNumber = String(todayInvoices.length + 1).padStart(2, '0');

    // Generate invoice number
    const invoiceNo = `INV/${year}/${month}/${day}/${sequenceNumber}`;

    // Add invoice number to data
    const invoiceData = {
      ...data,
      invoiceNo,
    };

    const result = await createInvoice(invoiceData);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error on creating invoice', error);
    return NextResponse.json(
      { error: 'Failed to create invoice' },
      { status: 500 }
    );
  }
}
