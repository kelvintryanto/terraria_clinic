'use server';

import {
  getCustomerByEmail,
  verifyCustomerPassword,
} from '@/app/models/customer';
import { getUserByEmail } from '@/app/models/user';
import { comparePass } from '@/app/utils/bcrypt';
import { sign } from '@/app/utils/jwt';
import { ObjectId } from 'mongodb';
import { ResponseCookies } from 'next/dist/compiled/@edge-runtime/cookies';
import { cookies } from 'next/headers';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(5, 'Password must be at least 5 characters'),
});

interface LoginState {
  error: string | null;
  success: boolean;
  pending: boolean;
  user?: {
    name: string;
    email: string;
  } | null;
  redirect?: string;
}

interface AuthUser {
  _id: ObjectId;
  email: string;
  name: string;
  role: string;
  profileImage?: string;
  googleUser?: boolean;
}

export async function loginAction(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  const parsedData = loginSchema.safeParse(data);

  if (!parsedData.success) {
    return {
      error: 'Invalid email or password',
      success: false,
      pending: false,
    };
  }

  // First try to find user in users collection (admin/super_admin)
  const adminUser = await getUserByEmail(parsedData.data.email);

  // Then try to find in customers collection
  const customer = await getCustomerByEmail(parsedData.data.email);

  if (!adminUser && !customer) {
    return {
      error: 'Invalid email or password',
      success: false,
      pending: false,
    };
  }

  let isValid = false;
  let userData: AuthUser | null = null;

  if (adminUser) {
    // Admin authentication logic
    isValid = await comparePass(parsedData.data.password, adminUser.password);
    if (isValid) {
      userData = {
        _id: adminUser._id,
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role,
      };
    }
  } else if (customer) {
    // Customer authentication
    isValid = await verifyCustomerPassword(
      parsedData.data.email,
      parsedData.data.password
    );
    if (isValid) {
      userData = {
        _id: customer._id,
        email: customer.email,
        name: customer.name,
        role: customer.role,
      };
    }
  }

  if (!isValid || !userData) {
    return {
      error: 'Invalid email or password',
      success: false,
      pending: false,
    };
  }

  // Create JWT token
  const token = await sign({
    id: userData._id.toString(),
    email: userData.email,
    name: userData.name,
    role: userData.role,
    profileImage: userData.profileImage,
    googleUser: userData.googleUser || false,
  });

  console.log(token, 'token');

  // Set cookie
  ((await cookies()) as unknown as ResponseCookies).set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
  });

  return {
    error: null,
    success: true,
    pending: false,
    user: {
      name: userData.name,
      email: userData.email,
    },
    redirect: ['super_admin', 'admin', 'admin2'].includes(userData.role)
      ? '/cms'
      : '/',
  };
}
