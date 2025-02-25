import { Db, ObjectId, UpdateFilter, WithId } from 'mongodb';
import { connectToDatabase } from '../config/config';

const DATABASE_NAME = 'terraria_clinic';
const COLLECTION = 'customers';

export interface Dog {
  _id: ObjectId;
  name: string;
  breed: string;
  age: number;
  color: string;
}

export type CreateDog = Omit<Dog, '_id'>;

export interface Customer {
  _id: ObjectId;
  name: string;
  email: string;
  phone: string;
  address: string;
  joinDate: string;
  role: string;
  dogs: Dog[];
  createdAt: string;
  updatedAt: string;
}

export type CreateCustomer = Omit<
  Customer,
  '_id' | 'dogs' | 'createdAt' | 'updatedAt'
> & {
  dogs: CreateDog[];
};

type MongoTimestamps = {
  createdAt: string;
  updatedAt: string;
};

export type CustomerDocument = WithId<Customer & MongoTimestamps>;

export const getDb = async () => {
  const client = await connectToDatabase();
  const db: Db = client.db(DATABASE_NAME);
  return db;
};

export const createCustomer = async (customer: CreateCustomer) => {
  const db = await getDb();

  // Add ObjectId to each dog
  const dogsWithIds = customer.dogs.map((dog) => ({
    ...dog,
    _id: new ObjectId(),
  }));

  const now = new Date().toISOString();
  const result = await db.collection<CustomerDocument>(COLLECTION).insertOne({
    ...customer,
    dogs: dogsWithIds,
    createdAt: now,
    updatedAt: now,
  } as CustomerDocument);

  return result;
};

export const getCustomerById = async (id: string) => {
  const db = await getDb();
  try {
    const customer = await db.collection<CustomerDocument>(COLLECTION).findOne({
      _id: new ObjectId(id),
    });
    return customer;
  } catch {
    throw new Error('Invalid customer ID');
  }
};

export const getAllCustomers = async () => {
  const db = await getDb();
  try {
    const customers = await db
      .collection<CustomerDocument>(COLLECTION)
      .find()
      .sort({ createdAt: -1 }) // Sort by newest first
      .toArray();
    return customers;
  } catch {
    throw new Error('Failed to fetch customers');
  }
};

export const updateCustomer = async (id: string, data: Partial<Customer>) => {
  const db = await getDb();

  try {
    const update: UpdateFilter<CustomerDocument> = {
      $set: {
        ...data,
        updatedAt: new Date().toISOString(),
      },
    };

    const result = await db
      .collection<CustomerDocument>(COLLECTION)
      .updateOne({ _id: new ObjectId(id) }, update);

    if (result.matchedCount === 0) {
      throw new Error('Customer not found');
    }

    return result;
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error('Failed to update customer');
  }
};

export const deleteCustomer = async (id: string) => {
  const db = await getDb();
  try {
    const result = await db.collection<CustomerDocument>(COLLECTION).deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      throw new Error('Customer not found');
    }

    return result;
  } catch {
    throw new Error('Failed to delete customer');
  }
};

export const addDogToCustomer = async (customerId: string, dog: CreateDog) => {
  const db = await getDb();
  const customer = await getCustomerById(customerId);

  if (!customer) {
    throw new Error('Customer not found');
  }

  try {
    const newDog: Dog = {
      _id: new ObjectId(),
      ...dog,
    };

    const update: UpdateFilter<CustomerDocument> = {
      $push: { dogs: newDog },
      $set: { updatedAt: new Date().toISOString() },
    };

    const result = await db
      .collection<CustomerDocument>(COLLECTION)
      .updateOne({ _id: new ObjectId(customerId) }, update);

    if (result.matchedCount === 0) {
      throw new Error('Customer not found');
    }

    return newDog;
  } catch {
    throw new Error('Failed to add dog to customer');
  }
};

export const removeDogFromCustomer = async (
  customerId: string,
  dogId: string
) => {
  const db = await getDb();

  try {
    const update: UpdateFilter<CustomerDocument> = {
      $pull: { dogs: { _id: new ObjectId(dogId) } },
      $set: { updatedAt: new Date().toISOString() },
    };

    const result = await db
      .collection<CustomerDocument>(COLLECTION)
      .updateOne({ _id: new ObjectId(customerId) }, update);

    if (result.matchedCount === 0) {
      throw new Error('Customer not found');
    }

    return result;
  } catch {
    throw new Error('Failed to remove dog from customer');
  }
};
