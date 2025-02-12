import { Db, ObjectId } from "mongodb";
import { connectToDatabase } from "../config/config";
import { hashPass } from "../utils/bcrypt";

const DATABASE_NAME = "terraria_clinic";
const COLLECTION = "users";

export type InputUser = {
  name: string;
  email: string;
  password: string;
  phone: string;
  role?: string;
};

export const getDb = async () => {
  const client = await connectToDatabase();
  const db: Db = client.db(DATABASE_NAME);
  return db;
};

export const registerUser = async (body: Omit<InputUser, "role">) => {
  const db = await getDb();
  const { password, ...rest } = body;
  const hashedPassword = await hashPass(password);

  const bodyInput = {
    ...rest,
    password: hashedPassword,
    role: "Customer",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const result = await db.collection(COLLECTION).insertOne(bodyInput);
  return result;
};

export const getUserByEmail = async (email: string) => {
  //ini dipakai saat login
  const db = await getDb();

  const result = db.collection(COLLECTION).findOne({ email });

  return result;
};

export const getUserById = async (id: string) => {
  const db = await getDb();
  const user = await db.collection("users").findOne({ _id: new ObjectId(id) });

  return user ? { id: user._id, name: user.name, email: user.email } : null;
};
