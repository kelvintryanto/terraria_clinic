import { Db, ObjectId, UpdateFilter, WithId } from "mongodb";
import { connectToDatabase } from "../config/config";

const DATABASE_NAME = "terrariavet";
const COLLECTION = "categories";

export interface Category {
  _id: ObjectId;
  name: string;
  type: "product" | "service";
  createdAt: string;
  updatedAt: string;
}

export type CreateCategory = Omit<Category, "_id" | "createdAt" | "updatedAt">;

type MongoTimestamps = {
  createdAt: string;
  updatedAt: string;
};

export type CategoryDocument = WithId<Category & MongoTimestamps>;

export const getDb = async () => {
  const client = await connectToDatabase();
  const db: Db = client.db(DATABASE_NAME);
  return db;
};

export const createCategory = async (category: CreateCategory) => {
  const db = await getDb();

  const now = new Date().toISOString();
  const result = await db.collection<Category>(COLLECTION).insertOne({
    ...category,
    createdAt: now,
    updatedAt: now,
  } as Category);

  return result;
};

export const getCategoryById = async (id: string) => {
  const db = await getDb();
  try {
    const category = await db.collection<CategoryDocument>(COLLECTION).findOne({
      _id: new ObjectId(id),
    });
    return category;
  } catch {
    throw new Error("Invalid category ID");
  }
};

export const getAllCategories = async () => {
  const db = await getDb();
  try {
    const categories = await db
      .collection<Category>(COLLECTION)
      .find()
      .sort({ name: 1 }) // Sort by newest first
      .toArray();
    return categories;
  } catch {
    throw new Error("Failed to fetch categories");
  }
};

export const updateCategory = async (id: string, data: Partial<Category>) => {
  const db = await getDb();

  try {
    const update: UpdateFilter<Category> = {
      $set: {
        ...data,
        updatedAt: new Date().toISOString(),
      },
    };

    const result = await db
      .collection<CategoryDocument>(COLLECTION)
      .updateOne({ _id: new ObjectId(id) }, update);

    if (result.matchedCount === 0) {
      throw new Error("Category not found");
    }

    return result;
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error("Failed to update category");
  }
};

export const deleteCategory = async (id: string) => {
  const db = await getDb();
  try {
    const result = await db.collection<CategoryDocument>(COLLECTION).deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      throw new Error("Category not found");
    }

    return result;
  } catch {
    throw new Error("Failed to delete category");
  }
};
