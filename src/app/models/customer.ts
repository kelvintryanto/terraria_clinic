import { Db, ObjectId, UpdateFilter, WithId } from 'mongodb';
import { connectToDatabase } from '../config/config';
import { comparePass, hashPass } from '../utils/bcrypt';
import type { Dog } from './dog';

const DATABASE_NAME = 'terrariavet';
const COLLECTION = 'customers';

export interface Customer {
  _id: ObjectId;
  name: string;
  email: string;
  phone: string;
  address: string;
  password?: string;
  role: string;
  joinDate: string;
  dogs: Dog[];
  createdAt: string;
  updatedAt: string;
  googleUser?: boolean;
  profileImage?: string;
}

export type CustomerDocument = WithId<Customer>;

export interface CreateCustomer {
  name: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  role: string;
  joinDate: string;
  dogs: Array<{
    name: string;
    breedId: string | null;
    customBreed: string | null;
    birthYear: string;
    birthMonth: string;
    color: string;
    weight: number;
    sex: 'male' | 'female';
    lastVaccineDate: string | null;
    lastDewormDate: string | null;
  }>;
}

export type CreateDog = Omit<Dog, '_id'>;

export const getDb = async () => {
  const client = await connectToDatabase();
  const db: Db = client.db(DATABASE_NAME);
  return db;
};

export const createCustomer = async (customer: CreateCustomer) => {
  const db = await getDb();

  if (!customer.password) customer.password = '123456';

  // Hash the password before storing
  const hashedPassword = await hashPass(customer.password);

  // Add ObjectId to each dog
  const dogsWithIds = customer.dogs.map((dog) => ({
    ...dog,
    _id: new ObjectId(),
  }));

  const now = new Date().toISOString();
  const result = await db.collection<CustomerDocument>(COLLECTION).insertOne({
    ...customer,
    password: hashedPassword,
    dogs: dogsWithIds,
    createdAt: now,
    updatedAt: now,
  } as CustomerDocument);

  return result;
};

export const getCustomerByEmail = async (email: string) => {
  const db = await getDb();
  return db.collection<CustomerDocument>(COLLECTION).findOne({ email });
};

export const verifyCustomerPassword = async (
  email: string,
  password: string
) => {
  const customer = await getCustomerByEmail(email);
  if (!customer || !customer.password) return false;
  return comparePass(password, customer.password);
};

export const getCustomerById = async (id: string) => {
  const db = await getDb();
  try {
    const customer = await db.collection<CustomerDocument>(COLLECTION).findOne({
      _id: new ObjectId(id),
    });

    return customer;
  } catch {
    throw new Error('Invalid customer ID');
  }
};

export const getAllCustomers = async () => {
  const db = await getDb();
  try {
    const customers = await db
      .collection<CustomerDocument>(COLLECTION)
      .find()
      .sort({ createdAt: -1 }) // Sort by newest first
      .toArray();
    return customers;
  } catch {
    throw new Error('Failed to fetch customers');
  }
};

export const updateCustomer = async (id: string, data: Partial<Customer>) => {
  const db = await getDb();

  try {
    const update: UpdateFilter<CustomerDocument> = {
      $set: {
        ...data,
        updatedAt: new Date().toISOString(),
      },
    };

    const result = await db
      .collection<CustomerDocument>(COLLECTION)
      .updateOne({ _id: new ObjectId(id) }, update);

    if (result.matchedCount === 0) {
      throw new Error('Customer not found');
    }

    return result;
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error('Failed to update customer');
  }
};

export const deleteCustomer = async (id: string) => {
  const db = await getDb();
  try {
    // First, delete all diagnoses related to this customer
    await db.collection('diagnoses').deleteMany({
      clientId: new ObjectId(id),
    });

    // Next, delete all invoices related to this customer
    // Invoices are linked by contact info or client name, we'll try to match by both
    const customer = await getCustomerById(id);
    if (customer) {
      await db.collection('invoices').deleteMany({
        $or: [{ contact: customer.phone }, { clientName: customer.name }],
      });
    }

    // Finally, delete the customer
    const result = await db.collection<CustomerDocument>(COLLECTION).deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      throw new Error('Customer not found');
    }

    return result;
  } catch (error) {
    console.error('Error in cascade delete customer:', error);
    throw new Error('Failed to delete customer and related data');
  }
};

export const addDogToCustomer = async (customerId: string, dog: CreateDog) => {
  const db = await getDb();
  const customer = await getCustomerById(customerId);

  if (!customer) {
    throw new Error('Customer not found');
  }

  try {
    const newDog: Dog = {
      _id: new ObjectId(),
      ...dog,
    };

    const update: UpdateFilter<CustomerDocument> = {
      $push: { dogs: newDog },
      $set: { updatedAt: new Date().toISOString() },
    };

    const result = await db
      .collection<CustomerDocument>(COLLECTION)
      .updateOne({ _id: new ObjectId(customerId) }, update);

    if (result.matchedCount === 0) {
      throw new Error('Customer not found');
    }

    return newDog;
  } catch {
    throw new Error('Failed to add dog to customer');
  }
};

export const removeDogFromCustomer = async (
  customerId: string,
  dogId: string
) => {
  const db = await getDb();

  try {
    const update: UpdateFilter<CustomerDocument> = {
      $pull: { dogs: { _id: new ObjectId(dogId) } },
      $set: { updatedAt: new Date().toISOString() },
    };

    const result = await db
      .collection<CustomerDocument>(COLLECTION)
      .updateOne({ _id: new ObjectId(customerId) }, update);

    if (result.matchedCount === 0) {
      throw new Error('Customer not found');
    }

    return result;
  } catch {
    throw new Error('Failed to remove dog from customer');
  }
};

export const updateDog = async (
  customerId: string,
  dogId: string,
  updatedDog: Partial<Dog>
) => {
  const db = await getDb();

  try {
    const update: UpdateFilter<CustomerDocument> = {
      $set: {
        'dogs.$[dog]': {
          _id: new ObjectId(dogId),
          ...updatedDog,
        },
        updatedAt: new Date().toISOString(),
      },
    };

    const result = await db
      .collection<CustomerDocument>(COLLECTION)
      .updateOne({ _id: new ObjectId(customerId) }, update, {
        arrayFilters: [{ 'dog._id': new ObjectId(dogId) }],
      });

    if (result.matchedCount === 0) {
      throw new Error('Customer not found');
    }

    return result;
  } catch {
    throw new Error('Failed to update dog');
  }
};

// When returning customer data to the client, exclude the password
export const excludePassword = (customer: CustomerDocument) => {
  delete customer.password;
  const customerWithoutPassword = { ...customer };
  return customerWithoutPassword;
};

export const verifyCustomerCurrentPassword = async (
  id: string,
  currentPassword: string
) => {
  try {
    const db = await getDb();
    console.log(`Attempting to verify password for customer ID: ${id}`);

    // Get customer by ID
    let customer;
    try {
      customer = await db.collection<CustomerDocument>(COLLECTION).findOne({
        _id: new ObjectId(id),
      });
    } catch (error) {
      console.error(`Error finding customer with ID ${id}:`, error);
      return false;
    }

    if (!customer) {
      console.error(`Customer not found with ID: ${id}`);
      return false;
    }

    // Check if the user is a Google user and doesn't have a password
    if (customer.googleUser && !customer.password) {
      console.log('Google user without password cannot change password');
      return false;
    }

    // For Google users, allow password change without current password verification
    if (customer.googleUser === true) {
      console.log(
        'Google user attempting to set a password, bypassing verification'
      );
      return true;
    }

    // Verify password
    const isValid = await comparePass(currentPassword, customer.password || '');
    console.log(`Password verification result: ${isValid}`);
    return isValid;
  } catch (error) {
    console.error('Error in verifyCustomerCurrentPassword:', error);
    return false;
  }
};

export const resetCustomerPassword = async (
  id: string,
  newPassword: string
) => {
  try {
    const db = await getDb();
    console.log(`Attempting to reset password for customer ID: ${id}`);

    const hashedPassword = await hashPass(newPassword);

    const result = await db.collection<CustomerDocument>(COLLECTION).updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          password: hashedPassword,
          updatedAt: new Date().toISOString(),
        },
      }
    );

    if (result.matchedCount === 0) {
      console.error(`No customer found for ID: ${id}`);
      throw new Error(`Customer not found for ID: ${id}`);
    }

    if (result.modifiedCount === 0) {
      console.warn(`Password not modified for customer ID: ${id}`);
    } else {
      console.log(`Password successfully reset for customer ID: ${id}`);
    }

    return result;
  } catch (error) {
    console.error('Error in resetCustomerPassword:', error);
    throw error;
  }
};
