import { withAuth } from '@/app/api/middleware';
import redis from '@/app/config/redis';
import { getDb } from '@/app/models/user';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  return withAuth(request, async (req, user) => {
    try {
      const body = await request.json();
      const db = await getDb();

      await redis.del(`user:${user.id}`);

      delete body.password;
      delete body._id;
      delete body.id;
      delete body.email;
      delete body.role;

      // Add updatedAt timestamp
      body.updatedAt = new Date().toISOString();

      // Try to update in users collection first
      let result = await db.collection('users').updateOne(
        {
          $or: [
            { _id: new ObjectId(user.id) },
            { _id: ObjectId.createFromHexString(user.id) },
          ],
        },
        { $set: body }
      );

      // If not found in users, try customers collection
      if (result.matchedCount === 0) {
        result = await db.collection('customers').updateOne(
          {
            $or: [
              { _id: new ObjectId(user.id) },
              { _id: ObjectId.createFromHexString(user.id) },
            ],
          },
          { $set: body }
        );

        // Clear customer caches if updated in customers collection
        if (result.matchedCount > 0) {
          await redis.del(`customer:${user.id}`);
          await redis.del('customers');
        }
      } else {
        // Clear user cache if updated in users collection
        await redis.del(`user:${user.id}`);
      }

      if (result.matchedCount === 0) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        message: 'Profile updated successfully',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      );
    }
  });
}
