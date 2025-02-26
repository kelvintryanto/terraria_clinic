import { Db, UpdateFilter } from "mongodb";
import { connectToDatabase } from "../config/config";

const DATABASE_NAME = "terraria_clinic";
const COLLECTION = "categories";

export interface Diagnose {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateDiagnose = Omit<Diagnose, "_id" | "createdAt" | "updatedAt">;

type MongoTimestamps = {
  createdAt: string;
  updatedAt: string;
};

export type DiagnoseDocument = Diagnose & MongoTimestamps;

export const getDb = async () => {
  const client = await connectToDatabase();
  const db: Db = client.db(DATABASE_NAME);
  return db;
};

export const createDiagnose = async (diagnose: CreateDiagnose) => {
  const db = await getDb();

  const now = new Date().toISOString();
  const result = await db.collection<Diagnose>(COLLECTION).insertOne({
    ...diagnose,
    createdAt: now,
    updatedAt: now,
  } as Diagnose);

  return result;
};

export const getDiagnoseById = async (id: string) => {
  const db = await getDb();
  try {
    const diagnose = await db.collection<DiagnoseDocument>(COLLECTION).findOne({
      _id: id,
    });
    return diagnose;
  } catch {
    throw new Error("Invalid diagnose ID");
  }
};

export const getAllDiagnoses = async () => {
  const db = await getDb();
  try {
    const diagnoses = await db
      .collection<Diagnose>(COLLECTION)
      .find()
      .sort({ name: 1 }) // Sort by newest first
      .toArray();
    return diagnoses;
  } catch {
    throw new Error("Failed to fetch diagnoses");
  }
};

export const updateDiagnose = async (id: string, data: Partial<Diagnose>) => {
  const db = await getDb();

  try {
    const update: UpdateFilter<DiagnoseDocument> = {
      $set: {
        ...data,
        updatedAt: new Date().toISOString(),
      },
    };

    const result = await db
      .collection<DiagnoseDocument>(COLLECTION)
      .updateOne({ _id: id }, update);

    if (result.matchedCount === 0) {
      throw new Error("Diagnose not found");
    }

    return result;
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error("Failed to update diagnose");
  }
};

export const deleteDiagnose = async (id: string) => {
  const db = await getDb();
  try {
    const result = await db.collection<DiagnoseDocument>(COLLECTION).deleteOne({
      _id: id,
    });

    if (result.deletedCount === 0) {
      throw new Error("Diagnose not found");
    }

    return result;
  } catch {
    throw new Error("Failed to delete diagnose");
  }
};
