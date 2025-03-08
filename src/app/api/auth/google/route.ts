import { connectToDatabase } from '@/app/config/config';
import { getCustomerByEmail } from '@/app/models/customer';
import { sign } from '@/app/utils/jwt';
import { OAuth2Client } from 'google-auth-library';
import { cookies } from 'next/headers';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const COLLECTION = 'customers';

export async function POST(request: Request) {
  try {
    const { credential } = await request.json();

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return Response.json({ message: 'Invalid token' }, { status: 400 });
    }

    const { email, name, picture } = payload;
    let customer = await getCustomerByEmail(email!);

    // If customer doesn't exist, register them
    if (!customer) {
      const db = await connectToDatabase();
      const now = new Date().toISOString();

      const newCustomer = {
        email: email!,
        name: name!,
        role: 'customer',
        joinDate: now,
        dogs: [],
        createdAt: now,
        updatedAt: now,
        googleUser: true,
        profileImage: picture,
        phone: '',
        address: '',
      };

      await db.db('terrariavet').collection(COLLECTION).insertOne(newCustomer);
      customer = await getCustomerByEmail(email!);
    }
    // If customer exists but doesn't have a profile image, update with Google image
    else if (!customer.profileImage && picture) {
      const db = await connectToDatabase();
      await db
        .db('terrariavet')
        .collection(COLLECTION)
        .updateOne(
          { email: email },
          {
            $set: {
              profileImage: picture,
              updatedAt: new Date().toISOString(),
            },
          }
        );
    }

    // Create JWT token
    const token = await sign({
      id: customer?._id.toString() ?? '',
      email: customer?.email ?? '',
      name: customer?.name ?? '',
      role: customer?.role ?? '',
      profileImage: customer?.profileImage ?? '',
      googleUser: customer?.googleUser ?? true,
    });

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
    });

    return Response.json({
      message: 'Login successful',
      redirect: '/',
    });
  } catch (error) {
    console.error('Google auth error:', error);
    return Response.json({ message: 'Authentication failed' }, { status: 500 });
  }
}
