import { withResourceOwnership } from '@/app/api/middleware';
import redis from '@/app/config/redis';
import { getDb } from '@/app/models/user';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

// GET: Fetch a user by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = (await params).id;

  // Use withResourceOwnership to ensure only the user themselves, admins, or super_admins can access
  return withResourceOwnership(request, userId, async () => {
    try {
      const cachedUser = await redis.get(`user:${userId}`);

      if (cachedUser) {
        return NextResponse.json(JSON.parse(cachedUser));
      }

      const db = await getDb();
      const userData = await db.collection('users').findOne(
        { _id: ObjectId.createFromHexString(userId) },
        { projection: { password: 0 } } // Exclude password
      );

      if (!userData) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      await redis.set(`user:${userId}`, JSON.stringify(userData));

      return NextResponse.json(userData);
    } catch (error) {
      console.error('Error fetching user:', error);
      return NextResponse.json(
        { error: 'Failed to fetch user' },
        { status: 500 }
      );
    }
  });
}

// PATCH: Update a user
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = params.id;

  return withResourceOwnership(request, userId, async (req, user) => {
    try {
      const body = await request.json();
      const db = await getDb();

      await redis.del(`user:${userId}`);

      // If trying to update role, check if user has permission
      if (body.role !== undefined && user.role !== 'super_admin') {
        // Remove role from update if not super_admin
        delete body.role;
      }

      // Prevent updating sensitive fields
      delete body.password;
      delete body._id;

      // Add updatedAt timestamp
      body.updatedAt = new Date().toISOString();

      const result = await db
        .collection('users')
        .updateOne(
          { _id: ObjectId.createFromHexString(userId) },
          { $set: body }
        );

      if (result.matchedCount === 0) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        message: 'User updated successfully',
      });
    } catch (error) {
      console.error('Error updating user:', error);
      return NextResponse.json(
        { error: 'Failed to update user' },
        { status: 500 }
      );
    }
  });
}

// DELETE: Delete a user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = params.id;

  return withResourceOwnership(request, userId, async (req, user) => {
    // Only super_admin or the user themselves can delete accounts
    if (user.role !== 'super_admin' && user.id !== userId) {
      return NextResponse.json(
        { error: 'You do not have permission to delete this user' },
        { status: 403 }
      );
    }

    try {
      const db = await getDb();

      await redis.del(`user:${userId}`);

      const result = await db.collection('users').deleteOne({
        _id: ObjectId.createFromHexString(userId),
      });

      if (result.deletedCount === 0) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      return NextResponse.json(
        { error: 'Failed to delete user' },
        { status: 500 }
      );
    }
  });
}
