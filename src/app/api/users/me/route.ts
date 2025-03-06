import { getUser } from '@/app/api/auth/server-auth';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error getting current user:', error);
    return NextResponse.json(
      { error: 'Failed to get user information' },
      { status: 500 }
    );
  }
}
