import { InvoiceData } from '@/data/types';
import { Db, ObjectId } from 'mongodb';
import { connectToDatabase } from '../config/config';

const DATABASE_NAME = 'terrariavet';
const COLLECTION = 'invoices';

export const getDb = async () => {
  const client = await connectToDatabase();
  const db: Db = client.db(DATABASE_NAME);
  return db;
};

export const createInvoice = async (invoice: Omit<InvoiceData, '_id'>) => {
  const db = await getDb();
  const bodyInput = {
    ...invoice,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const result = await db.collection(COLLECTION).insertOne(bodyInput);
  return result;
};

export const getAllInvoices = async () => {
  const db = await getDb();
  const invoices = await db
    .collection(COLLECTION)
    .find()
    .sort({ createdAt: -1 })
    .toArray();
  return invoices;
};

export const getInvoiceById = async (id: string) => {
  const db = await getDb();
  const invoice = await db.collection(COLLECTION).findOne({
    _id: ObjectId.createFromHexString(id),
  });
  return invoice;
};

export const updateInvoice = async (id: string, data: Partial<InvoiceData>) => {
  const db = await getDb();

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
    throw new Error('Invoice not found');
  }

  return result;
};

export const deleteInvoice = async (id: string) => {
  const db = await getDb();
  const result = await db.collection(COLLECTION).deleteOne({
    _id: ObjectId.createFromHexString(id),
  });

  if (result.deletedCount === 0) {
    throw new Error('Invoice not found');
  }

  return result;
};

export const getInvoicesByDate = async (date: Date) => {
  const db = await getDb();
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const invoices = await db
    .collection(COLLECTION)
    .find({
      createdAt: {
        $gte: startOfDay.toISOString(),
        $lte: endOfDay.toISOString(),
      },
    })
    .toArray();

  return invoices;
};

export const getInvoicesByContact = async (contactInfo: string) => {
  const db = await getDb();
  try {
    // Try to match either by contact (phone) or clientName
    const invoices = await db
      .collection(COLLECTION)
      .find({
        $or: [
          { contact: contactInfo },
          { clientName: { $regex: new RegExp(contactInfo, 'i') } },
        ],
      })
      .sort({ createdAt: -1 })
      .toArray();
    return invoices;
  } catch (error) {
    console.error('Error fetching invoices by contact:', error);
    throw new Error('Failed to fetch invoices for this contact');
  }
};

export const getInvoicesBySubAccount = async (subAccount: string) => {
  const db = await getDb();
  try {
    const invoices = await db
      .collection(COLLECTION)
      .find({ subAccount: { $regex: subAccount, $options: 'i' } })
      .sort({ createdAt: -1 })
      .toArray();
    return invoices;
  } catch (error) {
    console.error('Error fetching invoices by sub account:', error);
    return [];
  }
};
