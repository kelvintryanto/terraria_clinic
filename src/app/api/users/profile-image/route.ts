import { withAuth } from '@/app/api/middleware';
import cloudinary from '@/app/config/cloudinary';
import redis from '@/app/config/redis';
import { getDb } from '@/app/models/user';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { Readable } from 'stream';

// Helper function to convert File to Buffer
async function fileToBuffer(file: File): Promise<Buffer> {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

// Helper function to upload file to Cloudinary
async function uploadToCloudinary(
  buffer: Buffer,
  userId: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'customers',
        public_id: `user-${userId}`,
        overwrite: true,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result?.secure_url || '');
        }
      }
    );

    const readableStream = new Readable();
    readableStream.push(buffer);
    readableStream.push(null);
    readableStream.pipe(uploadStream);
  });
}

export async function POST(request: NextRequest) {
  return withAuth(request, async (_req, user) => {
    try {
      const formData = await request.formData();
      const file = formData.get('file') as File;

      if (!file) {
        return NextResponse.json(
          { error: 'No file uploaded' },
          { status: 400 }
        );
      }

      // Convert file to buffer
      const buffer = await fileToBuffer(file);

      // Upload to Cloudinary
      const imageUrl = await uploadToCloudinary(buffer, user.id);

      const db = await getDb();

      // Update user's profile image in the database
      const usersCollection = db.collection('users');
      const result = await usersCollection.updateOne(
        { _id: new ObjectId(user.id) },
        { $set: { profileImage: imageUrl } }
      );

      // If no user was found/updated, try updating in customers collection
      if (result.matchedCount === 0) {
        const customersCollection = db.collection('customers');
        await customersCollection.updateOne(
          { _id: new ObjectId(user.id) },
          { $set: { profileImage: imageUrl } }
        );
      }

      // Clear cache for this user
      await redis.del(`user:${user.id}`);

      return NextResponse.json({ success: true, imageUrl });
    } catch (error) {
      console.error('Error uploading profile image:', error);
      return NextResponse.json(
        { error: 'Failed to upload profile image' },
        { status: 500 }
      );
    }
  });
}

// Set bodyParser config to handle file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};
