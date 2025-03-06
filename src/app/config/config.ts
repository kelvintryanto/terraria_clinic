import { MongoClient } from "mongodb";
const uri = `${process.env.NEXT_PUBLIC_MONGODB_CONNECTION_STRING}`;
let client: MongoClient;

export const connectToDatabase = async () => {
  if (!client && uri) {
    client = new MongoClient(uri);
    await client.connect();
  }
  return client;
};
