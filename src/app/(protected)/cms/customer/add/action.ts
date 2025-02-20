'use server';

import { CreateCustomer, createCustomer } from '@/app/models/customer';
import { redirect } from 'next/navigation';

interface DogInput {
  name: string;
  breed: string;
  age: string;
  color: string;
}

export interface FormState {
  message: string | null;
  errors: {
    submit?: string;
  };
}

export async function addCustomer(prevState: FormState, formData: FormData) {
  // Get all dog fields
  const dogs: DogInput[] = [];
  const formEntries = Array.from(formData.entries());

  // Group dog fields
  formEntries.forEach(([key, value]) => {
    if (key.startsWith('dog-')) {
      const [, index, field] = key.split('-'); // Using comma to ignore unused variable
      const dogIndex = parseInt(index);

      if (!dogs[dogIndex]) {
        dogs[dogIndex] = { name: '', breed: '', age: '', color: '' };
      }

      dogs[dogIndex][field as keyof DogInput] = value.toString();
    }
  });

  // Filter out incomplete dog entries
  const validDogs = dogs.filter(
    (dog) => dog.name && dog.breed && dog.age && dog.color
  );

  const customerData: CreateCustomer = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string,
    address: formData.get('address') as string,
    coordinates: {
      lat: parseFloat(formData.get('lat') as string),
      lng: parseFloat(formData.get('lng') as string),
    },
    joinDate: new Date().toISOString(),
    dogs: validDogs.map((dog) => ({
      name: dog.name,
      breed: dog.breed,
      age: parseInt(dog.age),
      color: dog.color,
    })),
  };

  const result = await createCustomer(customerData);

  if (!result.insertedId) {
    return {
      message: 'Failed to create customer',
      errors: {
        submit: 'Database error occurred',
      },
    };
  }
  redirect('/cms/customer?success=created');
}
