import { ObjectId, UpdateFilter } from 'mongodb';
import { CustomerDocument, getDb } from './customer';

const COLLECTION = 'customers';

export interface Dog {
  _id: ObjectId;
  name: string;
  breed: string;
  age: number;
  color: string;
}

export interface AddDogInput {
  name: string;
  breed: string;
  age: number;
  color: string;
}

export const addDogToCustomer = async (
  customerId: string,
  dogData: AddDogInput
) => {
  const db = await getDb();

  const newDog: Dog = {
    _id: ObjectId.createFromHexString(),
    ...dogData,
  };

  const update: UpdateFilter<CustomerDocument> = {
    $push: { dogs: newDog },
    $set: { updatedAt: new Date().toISOString() },
  };

  const result = await db
    .collection<CustomerDocument>(COLLECTION)
    .updateOne({ _id: ObjectId.createFromHexString(customerId) }, update);

  if (result.matchedCount === 0) {
    throw new Error('Customer not found');
  }

  return { ...newDog };
};

export const removeDogFromCustomer = async (
  customerId: string,
  dogId: string
) => {
  const db = await getDb();

  const update: UpdateFilter<CustomerDocument> = {
    $pull: { dogs: { _id: ObjectId.createFromHexString(dogId) } },
    $set: { updatedAt: new Date().toISOString() },
  };

  const result = await db
    .collection<CustomerDocument>(COLLECTION)
    .updateOne({ _id: ObjectId.createFromHexString(customerId) }, update);

  if (result.matchedCount === 0) {
    throw new Error('Customer not found');
  }

  return result;
};

export const updateDog = async (
  customerId: string,
  dogId: string,
  dogData: Partial<AddDogInput>
) => {
  const db = await getDb();

  const updateFields: Record<string, unknown> = {};
  Object.entries(dogData).forEach(([key, value]) => {
    updateFields[`dogs.$.${key}`] = value;
  });

  const update: UpdateFilter<CustomerDocument> = {
    $set: {
      ...updateFields,
      updatedAt: new Date().toISOString(),
    },
  };

  const result = await db.collection<CustomerDocument>(COLLECTION).updateOne(
    {
      _id: ObjectId.createFromHexString(customerId),
      'dogs._id': ObjectId.createFromHexString(dogId),
    },
    update
  );

  if (result.matchedCount === 0) {
    throw new Error('Customer or dog not found');
  }

  return result;
};
