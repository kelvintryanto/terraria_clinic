import { ObjectId, UpdateFilter } from 'mongodb';
import { CustomerDocument, getDb } from './customer';

const COLLECTION = 'customers';

export interface Dog {
  _id: ObjectId;
  name: string;
  breedId: ObjectId | null;
  customBreed: string | null;
  age: number;
  color: string;
  weight: number;
  lastVaccineDate: string | null;
  lastDewormDate: string | null;
  sex: 'male' | 'female';
}

export interface AddDogInput {
  name: string;
  breedId: string | null;
  customBreed: string | null;
  age: number;
  color: string;
  weight: number;
  lastVaccineDate: string | null;
  lastDewormDate: string | null;
  sex: 'male' | 'female';
}

export const addDogToCustomer = async (
  customerId: string,
  dogData: AddDogInput
) => {
  const db = await getDb();

  const newDog: Dog = {
    _id: new ObjectId(),
    name: dogData.name,
    breedId: dogData.breedId ? new ObjectId(dogData.breedId) : null,
    customBreed: dogData.customBreed,
    age: dogData.age,
    color: dogData.color,
    weight: dogData.weight,
    lastVaccineDate: dogData.lastVaccineDate,
    lastDewormDate: dogData.lastDewormDate,
    sex: dogData.sex,
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
    if (key === 'breedId' && value) {
      updateFields[`dogs.$.${key}`] = new ObjectId(value as string);
    } else {
      updateFields[`dogs.$.${key}`] = value;
    }
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
