import { ObjectId, UpdateFilter } from 'mongodb';
import { CustomerDocument, getDb } from './customer';

const COLLECTION = 'customers';

export interface Dog {
  _id: ObjectId;
  name: string;
  breedId: ObjectId | null;
  customBreed: string | null;
  birthYear: string;
  birthMonth: string;
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
  birthYear: string;
  birthMonth: string;
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
    birthYear: dogData.birthYear,
    birthMonth: dogData.birthMonth,
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

  // Prepare update data
  const updateData: UpdateFilter<CustomerDocument> = {};

  // Handle each field that might be updated
  if (dogData.name !== undefined) {
    updateData['dogs.$.name'] = dogData.name;
  }

  if (dogData.breedId !== undefined) {
    updateData['dogs.$.breedId'] = dogData.breedId
      ? new ObjectId(dogData.breedId)
      : null;
  }

  if (dogData.customBreed !== undefined) {
    updateData['dogs.$.customBreed'] = dogData.customBreed;
  }

  if (dogData.birthYear !== undefined) {
    updateData['dogs.$.birthYear'] = dogData.birthYear;
  }

  if (dogData.birthMonth !== undefined) {
    updateData['dogs.$.birthMonth'] = dogData.birthMonth;
  }

  if (dogData.color !== undefined) {
    updateData['dogs.$.color'] = dogData.color;
  }

  if (dogData.weight !== undefined) {
    updateData['dogs.$.weight'] = dogData.weight;
  }

  if (dogData.sex !== undefined) {
    updateData['dogs.$.sex'] = dogData.sex;
  }

  if (dogData.lastVaccineDate !== undefined) {
    updateData['dogs.$.lastVaccineDate'] = dogData.lastVaccineDate;
  }

  if (dogData.lastDewormDate !== undefined) {
    updateData['dogs.$.lastDewormDate'] = dogData.lastDewormDate;
  }

  // Add updatedAt timestamp
  updateData['updatedAt'] = new Date().toISOString();

  const result = await db.collection<CustomerDocument>(COLLECTION).updateOne(
    {
      _id: new ObjectId(customerId),
      'dogs._id': new ObjectId(dogId),
    },
    { $set: updateData }
  );

  if (result.matchedCount === 0) {
    throw new Error('Dog not found');
  }

  return result;
};
