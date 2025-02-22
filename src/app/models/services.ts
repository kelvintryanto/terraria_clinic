import { Service } from '@/data/types';
import { Db, ObjectId } from 'mongodb';
import { connectToDatabase } from '../config/config';

const DATABASE_NAME = 'terraria_clinic';
const COLLECTION = 'services';

export const getDb = async () => {
  const client = await connectToDatabase();
  const db: Db = client.db(DATABASE_NAME);
  return db;
};

export const createService = async (
  service: Omit<Service, '_id' | 'createdAt' | 'updatedAt'>
) => {
  const db = await getDb();
  const bodyInput = {
    ...service,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const result = await db.collection(COLLECTION).insertOne(bodyInput);
  return result;
};

export const getAllServices = async () => {
  const db = await getDb();
  const services = await db
    .collection(COLLECTION)
    .find()
    .sort({ createdAt: -1 })
    .toArray();
  return services;
};

export const getServiceById = async (id: string) => {
  const db = await getDb();
  const service = await db.collection(COLLECTION).findOne({
    _id: ObjectId.createFromHexString(id),
  });
  return service;
};

export const updateService = async (id: string, data: Partial<Service>) => {
  const db = await getDb();
  delete data._id;

  const update = {
    $set: {
      ...data,
      updatedAt: new Date().toISOString(),
    },
  };

  const result = await db
    .collection(COLLECTION)
    .updateOne({ _id: ObjectId.createFromHexString(id) }, update);

  if (result.matchedCount === 0) {
    throw new Error('Service not found');
  }

  return result;
};

export const deleteService = async (id: string) => {
  const db = await getDb();
  const result = await db.collection(COLLECTION).deleteOne({
    _id: ObjectId.createFromHexString(id),
  });

  if (result.deletedCount === 0) {
    throw new Error('Service not found');
  }

  return result;
};
