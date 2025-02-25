import { withSuperAdminAccess } from '@/app/api/middleware';
import { getDb } from '@/app/models/user';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Define schema for role update
const roleSchema = z.object({
  role: z.enum(['super_admin', 'admin', 'Customer']),
});

// PATCH: Update user role (super_admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withSuperAdminAccess(request, async () => {
    try {
      const userId = params.id;
      const body = await request.json();

      // Validate role
      const result = roleSchema.safeParse(body);
      if (!result.success) {
        return NextResponse.json(
          {
            error: 'Invalid role. Must be one of: super_admin, admin, Customer',
          },
          { status: 400 }
        );
      }

      const db = await getDb();

      // Check if user exists
      const user = await db.collection('users').findOne({
        _id: ObjectId.createFromHexString(userId),
      });

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      // Update role
      await db.collection('users').updateOne(
        { _id: ObjectId.createFromHexString(userId) },
        {
          $set: {
            role: result.data.role,
            updatedAt: new Date().toISOString(),
          },
        }
      );

      return NextResponse.json({
        success: true,
        message: `User role updated to ${result.data.role}`,
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      return NextResponse.json(
        { error: 'Failed to update user role' },
        { status: 500 }
      );
    }
  });
}
