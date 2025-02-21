import { Db, ObjectId } from 'mongodb';
import { connectToDatabase } from '../config/config';

export interface Product {
  _id?: ObjectId;
  kode: string;
  name: string;
  category: string;
  description: string;
  jumlah: number;
  harga: number;
  createdAt?: string;
  updatedAt?: string;
}

const DATABASE_NAME = 'terraria_clinic';
const COLLECTION = 'products';

export const getDb = async () => {
  const client = await connectToDatabase();
  const db: Db = client.db(DATABASE_NAME);
  return db;
};

export const createProduct = async (
  product: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>
) => {
  const db = await getDb();
  const bodyInput = {
    ...product,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const result = await db.collection(COLLECTION).insertOne(bodyInput);
  return result;
};

export const getAllProducts = async () => {
  const db = await getDb();
  const products = await db
    .collection(COLLECTION)
    .find()
    .sort({ createdAt: -1 })
    .toArray();
  return products;
};

export const getProductById = async (id: string) => {
  const db = await getDb();
  const product = await db.collection(COLLECTION).findOne({
    _id: ObjectId.createFromHexString(id),
  });
  return product;
};

export const updateProduct = async (id: string, data: Partial<Product>) => {
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
    throw new Error('Product not found');
  }

  return result;
};

export const deleteProduct = async (id: string) => {
  const db = await getDb();
  const result = await db.collection(COLLECTION).deleteOne({
    _id: ObjectId.createFromHexString(id),
  });

  if (result.deletedCount === 0) {
    throw new Error('Product not found');
  }

  return result;
};
