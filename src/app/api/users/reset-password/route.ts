import {
  resetCustomerPassword,
  verifyCustomerCurrentPassword,
} from '@/app/models/customer';
import { verify } from '@/app/utils/jwt';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token?.value) {
      return Response.json(
        { message: 'Unauthorized: No token found' },
        { status: 401 }
      );
    }

    const user = await verify(token.value);
    if (!user) {
      return Response.json(
        { message: 'Unauthorized: Invalid token' },
        { status: 401 }
      );
    }

    // Log user info for debugging
    console.log('Password reset request for user:', {
      id: user.id,
      email: user.email,
      googleUser: user.googleUser,
    });

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!newPassword || newPassword.length < 6) {
      return Response.json(
        {
          message: 'Password baru harus minimal 6 karakter',
        },
        { status: 400 }
      );
    }

    // If the user is a Google user and setting a password for the first time
    if (user.googleUser === true) {
      console.log('Google user setting a password for the first time');
      try {
        await resetCustomerPassword(user.id, newPassword);
        return Response.json({
          message: 'Password berhasil disimpan',
        });
      } catch (error) {
        console.error('Error setting password for Google user:', error);
        return Response.json(
          {
            message: 'Gagal menyimpan password. Silakan coba lagi.',
          },
          { status: 500 }
        );
      }
    }

    try {
      const isValidPassword = await verifyCustomerCurrentPassword(
        user.id,
        currentPassword
      );
      if (!isValidPassword) {
        console.log('Password verification failed for user:', user.id);
        return Response.json(
          {
            message:
              'Password saat ini tidak sesuai. Pastikan Anda memasukkan password yang benar.',
          },
          { status: 400 }
        );
      }
    } catch (error) {
      console.error('Error during password verification:', error);
      return Response.json(
        {
          message: 'Gagal memverifikasi password saat ini. Silakan coba lagi.',
        },
        { status: 500 }
      );
    }

    try {
      await resetCustomerPassword(user.id, newPassword);
      return Response.json({
        message: 'Password berhasil diubah',
      });
    } catch (error) {
      console.error('Error resetting password:', error);
      return Response.json(
        {
          message: 'Gagal mengubah password. Silakan coba lagi.',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Password change failed:', error);
    return Response.json(
      {
        message: 'Gagal mengubah password. Silakan coba lagi.',
      },
      { status: 500 }
    );
  }
}
