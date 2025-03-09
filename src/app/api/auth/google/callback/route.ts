import { connectToDatabase } from '@/app/config/config';
import { getCustomerByEmail } from '@/app/models/customer';
import { sign } from '@/app/utils/jwt';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const COLLECTION = 'customers';

export async function GET(request: NextRequest) {
  try {
    // Get the authorization code from the URL
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.redirect(
        new URL('/login?error=No authorization code received', request.url)
      );
    }

    // Exchange the code for tokens
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const origin = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    // const redirectUri = `${origin}/api/auth/google/callback`;

    // Use the exact redirect URI that's configured in Google Cloud Console
    let redirectUri = 'http://localhost:3000/api/auth/google/callback';

    // For production, we'll use the terrariavet.com domain if the origin matches
    if (origin.includes('terrariavet.com')) {
      redirectUri = 'https://terrariavet.com/api/auth/google/callback';
    }

    // Log the redirect URI for debugging
    console.log('Callback using redirect URI:', redirectUri);

    if (!clientId || !clientSecret) {
      return NextResponse.redirect(
        new URL('/login?error=Google credentials not configured', request.url)
      );
    }

    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error('Token exchange error:', tokenData);
      return NextResponse.redirect(
        new URL('/login?error=Failed to exchange code for tokens', request.url)
      );
    }

    // Get user info with the access token
    const userInfoResponse = await fetch(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      }
    );

    const userInfo = await userInfoResponse.json();

    if (!userInfoResponse.ok) {
      console.error('User info error:', userInfo);
      return NextResponse.redirect(
        new URL('/login?error=Failed to get user info', request.url)
      );
    }

    const { email, name, picture } = userInfo;

    // Check if user exists in database
    let customer = await getCustomerByEmail(email);

    // If customer doesn't exist, register them
    if (!customer) {
      const db = await connectToDatabase();
      const now = new Date().toISOString();

      const newCustomer = {
        email: email,
        name: name,
        role: 'Customer',
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
      customer = await getCustomerByEmail(email);
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
      path: '/',
    });

    // Redirect to home page
    return NextResponse.redirect(new URL('/', request.url));
  } catch (error) {
    console.error('Google callback error:', error);
    return NextResponse.redirect(
      new URL('/login?error=Authentication failed', request.url)
    );
  }
}
