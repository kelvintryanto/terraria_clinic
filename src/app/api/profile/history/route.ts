import { withAuth } from '@/app/api/middleware';
import { getCustomerByEmail } from '@/app/models/customer';
import { getDiagnosesByClientId } from '@/app/models/diagnose';
import { getInvoicesByContact } from '@/app/models/invoice';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    try {
      // First, find the customer by email
      const customer = await getCustomerByEmail(user.email);

      if (!customer) {
        return NextResponse.json(
          { diagnoses: [], invoices: [] },
          { status: 200 }
        );
      }

      // Fetch diagnoses using customer's ID
      const diagnoses = await getDiagnosesByClientId(customer._id.toString());

      // Fetch invoices using customer's phone number or name
      const invoices = await getInvoicesByContact(
        customer.phone || customer.name
      );

      return NextResponse.json(
        {
          diagnoses: diagnoses || [],
          invoices: invoices || [],
        },
        { status: 200 }
      );
    } catch (error) {
      console.error('Error fetching user history:', error);
      return NextResponse.json(
        { error: 'Failed to fetch history' },
        { status: 500 }
      );
    }
  });
}
