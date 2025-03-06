import { withAuth } from '@/app/api/middleware';
import redis from '@/app/config/redis';
import {
  createInvoice,
  getAllInvoices,
  getInvoicesByDate,
} from '@/app/models/invoice';
import { canCreateInvoice } from '@/app/utils/auth';
import { InvoiceData, ServiceItem } from '@/data/types';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const invoices = await getAllInvoices();

    const cachedInvoices = await redis.get('invoices');

    if (cachedInvoices) {
      return NextResponse.json(JSON.parse(cachedInvoices));
    }

    await redis.set('invoices', JSON.stringify(invoices));

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
  return withAuth(request, async (req, user) => {
    if (!canCreateInvoice(user.role)) {
      return NextResponse.json(
        { error: 'Access denied. Create invoice privileges required' },
        { status: 403 }
      );
    }

    try {
      const data = await request.json();

      await redis.del('invoices');

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

      // Process data based on type
      const processedData: InvoiceData = {
        ...data,
        invoiceNo,
        // Set status based on type
        status: data.type === 'inpatient' ? 'Dirawat Inap' : 'Rawat Jalan',
        // For outpatient, ensure dischargeDate and dischargeTime are undefined and deposit/balance are 0
        dischargeDate:
          data.type === 'outpatient' ? undefined : data.dischargeDate,
        dischargeTime:
          data.type === 'outpatient' ? undefined : data.dischargeTime,
        deposit: data.type === 'outpatient' ? 0 : data.deposit || 0,
        balance: data.type === 'outpatient' ? 0 : data.balance || 0,
        // Ensure required fields are present
        inpatientDate: data.inpatientDate,
        inpatientTime: data.inpatientTime,
        clientName: data.clientName,
        contact: data.contact,
        subAccount: data.subAccount,
        location: data.location || 'Klinik Hewan Velvet Care Ciangsana',
        total: data.total,
        services: data.services.map((service: Partial<ServiceItem>) => ({
          ...service,
          date: service.date,
          price: service.price,
          name: service.name,
          _id: service._id,
        })),
        cartItems: data.cartItems,
        tax: data.tax,
        subtotal: data.subtotal,
        type: data.type,
      };

      const result = await createInvoice(processedData);
      return NextResponse.json(result);
    } catch (error) {
      console.error('Error on creating invoice', error);
      return NextResponse.json(
        { error: 'Failed to create invoice' },
        { status: 500 }
      );
    }
  });
}
