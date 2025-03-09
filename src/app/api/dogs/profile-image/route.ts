import { withAuth } from '@/app/api/middleware';
import cloudinary from '@/app/config/cloudinary';
import redis from '@/app/config/redis';
import { getCustomerByEmail, updateDog } from '@/app/models/customer';
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
  dogId: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'dogs', // Store in 'dogs' folder
        public_id: `dog-${dogId}`,
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
      const dogId = formData.get('dogId') as string;
      let customerId = formData.get('customerId') as string;

      if (!file) {
        return NextResponse.json(
          { error: 'No file uploaded' },
          { status: 400 }
        );
      }

      if (!dogId) {
        return NextResponse.json(
          { error: 'Dog ID is required' },
          { status: 400 }
        );
      }

      // Verify ownership if not admin
      if (user.role !== 'super_admin' && user.role !== 'admin') {
        const customer = await getCustomerByEmail(user.email);
        if (!customer) {
          return NextResponse.json(
            { error: 'Customer not found' },
            { status: 404 }
          );
        }

        const ownsDog = customer.dogs.some(
          (dog) => dog._id.toString() === dogId
        );
        if (!ownsDog) {
          return NextResponse.json(
            { error: 'You do not own this dog' },
            { status: 403 }
          );
        }

        // Use customer ID from the customer object
        if (!customerId) {
          customerId = customer._id.toString();
        }
      }

      if (!customerId) {
        return NextResponse.json(
          { error: 'Customer ID is required' },
          { status: 400 }
        );
      }

      // Convert file to buffer
      const buffer = await fileToBuffer(file);

      // Upload to Cloudinary
      const imageUrl = await uploadToCloudinary(buffer, dogId);

      // Update dog's profile image in the database
      await updateDog(customerId, dogId, {
        profileImage: imageUrl,
      });

      // Clear all relevant caches
      await redis.del(`customer:${customerId}`);
      await redis.del('customers'); // Clear the customers list cache too

      return NextResponse.json({ success: true, imageUrl });
    } catch (error) {
      console.error('Error uploading dog profile image:', error);
      return NextResponse.json(
        { error: 'Failed to upload dog profile image' },
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
