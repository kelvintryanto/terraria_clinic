import { withCmsAccess } from '@/app/api/middleware';
import redis from '@/app/config/redis';
import { getDb } from '@/app/models/user';
import { hashPass } from '@/app/utils/bcrypt';
import { NextRequest, NextResponse } from 'next/server';

// GET: List all users (admin and super_admin only)
export async function GET(request: NextRequest) {
  return withCmsAccess(request, async () => {
    try {
      const cachedUsers = await redis.get('users');

      if (cachedUsers) {
        return NextResponse.json(JSON.parse(cachedUsers));
      }

      const db = await getDb();
      const users = await db
        .collection('users')
        .find({}, { projection: { password: 0 } })
        .toArray();

      return NextResponse.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      return NextResponse.json(
        { error: 'Failed to fetch users' },
        { status: 500 }
      );
    }
  });
}

// POST: Create a new user (admin and super_admin only)
export async function POST(request: NextRequest) {
  return withCmsAccess(request, async (req, user) => {
    try {
      const body = await request.json();
      const db = await getDb();

      await redis.del('users');

      // Validate required fields
      if (!body.name || !body.email || !body.password) {
        return NextResponse.json(
          { error: 'Name, email, and password are required' },
          { status: 400 }
        );
      }

      // Check if email already exists
      const existingUser = await db
        .collection('users')
        .findOne({ email: body.email });
      if (existingUser) {
        return NextResponse.json(
          { error: 'Email already in use' },
          { status: 400 }
        );
      }

      // Only super_admin can set roles other than "Customer"
      if (
        body.role &&
        body.role !== 'customer' &&
        user.role !== 'super_admin'
      ) {
        // If not super_admin, force role to be "Customer"
        body.role = 'customer';
      }

      // If no role specified, default to "Customer"
      if (!body.role) {
        body.role = 'customer';
      }

      // Hash password
      body.password = await hashPass(body.password);

      // Add timestamps
      body.createdAt = new Date().toISOString();
      body.updatedAt = new Date().toISOString();

      const result = await db.collection('users').insertOne(body);

      return NextResponse.json({
        success: true,
        message: 'User created successfully',
        userId: result.insertedId,
      });
    } catch (error) {
      console.error('Error creating user:', error);
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }
  });
}
