import { withSuperAdminAccess } from '@/app/api/middleware';
import { getDb } from '@/app/models/user';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

// DELETE: Delete a user (super_admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withSuperAdminAccess(request, async () => {
    try {
      const userId = (await params).id;
      const db = await getDb();

      // Check if user exists and get their role
      const user = await db.collection('users').findOne({
        _id: ObjectId.createFromHexString(userId),
      });

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      // Prevent deletion of super_admin users
      if (user.role === 'super_admin') {
        return NextResponse.json(
          { error: 'Super admin users cannot be deleted' },
          { status: 403 }
        );
      }

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
