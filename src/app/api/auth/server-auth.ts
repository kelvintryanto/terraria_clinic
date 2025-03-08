import { verify } from '@/app/utils/jwt';
import { cookies } from 'next/headers';

export async function getUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token) return null;

    const user = await verify(token?.value);

    return user;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

export async function getUserFromRequest() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return null;
    }

    const user = await verify(token);
    return user;
  } catch (error) {
    console.error('Error getting user from request:', error);
    return null;
  }
}
