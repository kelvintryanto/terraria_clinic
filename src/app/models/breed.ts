import { Db, ObjectId } from 'mongodb';
import { connectToDatabase } from '../config/config';

export interface Breed {
  _id: ObjectId;
  name: string;
}

const DATABASE_NAME = 'terraria_clinic';

export const getDb = async () => {
  const client = await connectToDatabase();
  const db: Db = client.db(DATABASE_NAME);
  return db;
};

export async function getAllBreeds(): Promise<Breed[]> {
  const db = await getDb();
  const collection = db.collection<Breed>('breeds');

  return collection.find().sort({ name: 1 }).toArray();
}

export async function getBreedById(id: string): Promise<Breed | null> {
  const db = await getDb();
  const collection = db.collection<Breed>('breeds');

  return collection.findOne({ _id: new ObjectId(id) });
}
