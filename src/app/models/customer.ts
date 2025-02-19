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
  coordinates: {
    lat: number;
    lng: number;
  };
  joinDate: string;
  dogs: Dog[];
}

export type CreateCustomer = Omit<Customer, '_id' | 'dogs'> & {
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

  const result = await db.collection<CustomerDocument>(COLLECTION).insertOne({
    ...customer,
    dogs: dogsWithIds,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as CustomerDocument);

  return result;
};

export const getCustomerById = async (id: string) => {
  const db = await getDb();
  const customer = await db.collection<CustomerDocument>(COLLECTION).findOne({
    _id: new ObjectId(id),
  });
  return customer;
};

export const getAllCustomers = async () => {
  const db = await getDb();
  const customers = await db
    .collection<CustomerDocument>(COLLECTION)
    .find()
    .toArray();
  return customers;
};

export const updateCustomer = async (id: string, data: Partial<Customer>) => {
  const db = await getDb();

  // Remove _id from update data if it exists
  delete data._id;

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
};

export const deleteCustomer = async (id: string) => {
  const db = await getDb();
  const result = await db.collection<CustomerDocument>(COLLECTION).deleteOne({
    _id: new ObjectId(id),
  });

  if (result.deletedCount === 0) {
    throw new Error('Customer not found');
  }

  return result;
};

export const addDogToCustomer = async (
  customerId: string,
  dog: Omit<Dog, '_id'>
) => {
  const db = await getDb();
  const customer = await getCustomerById(customerId);

  if (!customer) {
    throw new Error('Customer not found');
  }

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
  return result;
};

export const removeDogFromCustomer = async (
  customerId: string,
  dogId: string
) => {
  const db = await getDb();

  const update: UpdateFilter<CustomerDocument> = {
    $pull: { dogs: { _id: new ObjectId(dogId) } },
    $set: { updatedAt: new Date().toISOString() },
  };

  const result = await db
    .collection<CustomerDocument>(COLLECTION)
    .updateOne({ _id: new ObjectId(customerId) }, update);
  return result;
};
