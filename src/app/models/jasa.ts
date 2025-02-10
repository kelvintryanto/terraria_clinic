import { Db, ObjectId } from "mongodb";
import { connectToDatabase } from "../config/config";

const DATABASE_NAME = "terraria_clinic";
const COLLECTION = "jasa";

export type InputJasa = {
  userId: string;
  jasa: string;
  status: string;
  bookingDate: string;
};

export const getDb = async () => {
  const client = await connectToDatabase();
  const db: Db = client.db(DATABASE_NAME);
  return db;
};

export const createJasaAntar = async (body: InputJasa) => {
  const db = await getDb();
  const bodyInput = {
    ...body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const result = await db.collection(COLLECTION).insertOne(bodyInput);

  return result;
};

export const readJasaAntarByLoginId = async (id: string) => {
  const db = await getDb();

  const result = await db
    .collection(COLLECTION)
    .find({ _id: new ObjectId(id) })
    .toArray();

  return result;
};

export const gunakanJasaById = async (id: string) => {
  const db = await getDb();

  const book = await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });

  // tinggal dicari tapi persetujuan dlu
};
