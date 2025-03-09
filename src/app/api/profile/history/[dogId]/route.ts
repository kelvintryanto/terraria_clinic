import { withAuth } from '@/app/api/middleware';
import { getCustomerByEmail } from '@/app/models/customer';
import { getDiagnosesByDogId } from '@/app/models/diagnose';
import { getInvoicesBySubAccount } from '@/app/models/invoice';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ dogId: string }> }
) {
  return withAuth(request, async (req, user) => {
    try {
      const { dogId } = await params;

      if (!dogId) {
        return NextResponse.json(
          { error: 'Dog ID is required' },
          { status: 400 }
        );
      }

      // Find the customer by email to verify ownership
      const customer = await getCustomerByEmail(user.email);

      if (!customer) {
        return NextResponse.json(
          { error: 'Customer not found' },
          { status: 404 }
        );
      }

      // Verify dog ownership
      const ownsDog = customer.dogs.some((dog) => dog._id.toString() === dogId);
      if (!ownsDog) {
        return NextResponse.json(
          { error: 'Dog not found for this customer' },
          { status: 404 }
        );
      }

      // Find the dog to get its name
      const dog = customer.dogs.find((d) => d._id.toString() === dogId);

      if (!dog) {
        return NextResponse.json({ error: 'Dog not found' }, { status: 404 });
      }

      // Fetch diagnoses for this specific dog
      const diagnoses = await getDiagnosesByDogId(dogId);

      // Fetch invoices where this dog is the sub account
      const invoices = await getInvoicesBySubAccount(dog.name);

      // Add the dog's name to each diagnose and invoice
      const diagnosesWithDogName = diagnoses.map((diagnose) => ({
        ...diagnose,
        dogName: dog.name, // Add dog name to each diagnose
      }));

      const invoicesWithDogName = invoices.map((invoice) => ({
        ...invoice,
        dogName: dog.name, // Add dog name to each invoice
      }));

      return NextResponse.json(
        {
          dog: {
            name: dog.name,
            id: dog._id,
          },
          diagnoses: diagnosesWithDogName || [],
          invoices: invoicesWithDogName || [],
        },
        { status: 200 }
      );
    } catch (error) {
      console.error('Error fetching dog history:', error);
      return NextResponse.json(
        { error: 'Failed to fetch dog history' },
        { status: 500 }
      );
    }
  });
}
