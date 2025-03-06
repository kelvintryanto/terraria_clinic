import { Db, ObjectId } from "mongodb";
import { connectToDatabase } from "../config/config";

const DATABASE_NAME = "terrariavet";
const COLLECTION = "obat";

export type InputObat = {
  name: string;
  category: string;
  price: number;
  stock: number;
};

export const getDb = async () => {
  const client = await connectToDatabase();
  const db: Db = client.db(DATABASE_NAME);
  return db;
};

export const createObat = async (body: InputObat) => {
  const db = await getDb();
  const bodyInput = {
    ...body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const result = await db.collection(COLLECTION).insertOne(bodyInput);

  return result;
};

export const getObatById = async (id: string) => {
  const db = await getDb();

  const result = await db
    .collection(COLLECTION)
    .findOne({ _id: ObjectId.createFromHexString(id) });

  return result;
};

export const getObat = async () => {
  const db = await getDb();

  const result = await db.collection(COLLECTION).find().toArray();

  return result;
};

export const getObatByName = async (name: string) => {
  const db = await getDb();

  const result = await db.collection(COLLECTION).findOne({ name });

  return result;
};

export const getObatByCategory = async (name: string) => {
  const db = await getDb();

  const result = await db.collection(COLLECTION).find({ name }).toArray();

  return result;
};
