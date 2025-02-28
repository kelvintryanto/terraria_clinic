import redis from '@/app/config/redis';
import { getCustomerById, updateCustomer } from '@/app/models/customer';
import { Dog } from '@/app/models/dog';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const dogSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  breedId: z.string().nullable(),
  customBreed: z.string().nullable(),
  age: z.number().min(0, 'Age must be a positive number'),
  color: z.string().min(1, 'Color is required'),
  weight: z.number().min(0, 'Weight must be a positive number'),
  lastVaccineDate: z.string().nullable(),
  lastDewormDate: z.string().nullable(),
  sex: z.enum(['male', 'female'], {
    required_error: 'Sex is required',
    invalid_type_error: 'Sex must be either male or female',
  }),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const customerId = (await params).id;
    const body = await request.json();

    await redis.del(`customer:${customerId}`);

    // Validate request body against schema
    const result = dogSchema.safeParse(body);
    if (!result.success) {
      const errorMessage = result.error.errors
        .map((err) => `${err.path}: ${err.message}`)
        .join(', ');
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    // Get customer
    const customer = await getCustomerById(customerId);
    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    // Create new dog object
    const newDog: Dog = {
      _id: new ObjectId(),
      name: result.data.name,
      breedId: result.data.breedId ? new ObjectId(result.data.breedId) : null,
      customBreed: result.data.customBreed,
      age: result.data.age,
      color: result.data.color,
      weight: result.data.weight,
      lastVaccineDate: result.data.lastVaccineDate,
      lastDewormDate: result.data.lastDewormDate,
      sex: result.data.sex,
    };

    // Add dog to customer's dogs array
    customer.dogs.push(newDog);

    // Update customer
    const updatedCustomer = await updateCustomer(customerId, customer);

    // Convert ObjectIds to strings in the response
    const responseCustomer = {
      ...updatedCustomer,
      dogs: customer.dogs.map((dog) => ({
        ...dog,
        _id: dog._id.toString(),
        breedId: dog.breedId?.toString() || null,
      })),
    };

    return NextResponse.json(responseCustomer);
  } catch (error) {
    console.error('Error adding dog:', error);
    return NextResponse.json({ error: 'Failed to add dog' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; dogId: string }> }
) {
  try {
    const { id: customerId, dogId } = await params;

    await redis.del(`customer:${customerId}`);

    // Get customer
    const customer = await getCustomerById(customerId);
    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    // Remove dog from customer's dogs array
    customer.dogs = customer.dogs.filter((dog) => dog._id.toString() !== dogId);

    // Update customer
    const updatedCustomer = await updateCustomer(customerId, customer);

    // Convert ObjectIds to strings in the response
    const responseCustomer = {
      ...updatedCustomer,
      dogs: customer.dogs.map((dog) => ({
        ...dog,
        _id: dog._id.toString(),
        breedId: dog.breedId?.toString() || null,
      })),
    };

    return NextResponse.json(responseCustomer);
  } catch (error) {
    console.error('Error deleting dog:', error);
    return NextResponse.json(
      { error: 'Failed to delete dog' },
      { status: 500 }
    );
  }
}
