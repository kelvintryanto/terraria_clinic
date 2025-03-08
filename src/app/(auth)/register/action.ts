'use server';

import redis from '@/app/config/redis';
import { createCustomer } from '@/app/models/customer';
import { getUserByEmail } from '@/app/models/user';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const registerSchema = z
  .object({
    name: z.string().min(1, 'Nama lengkap wajib diisi'),
    email: z.string().email('Format email tidak valid'),
    password: z.string().min(5, 'Password minimal 5 karakter'),
    confirmPassword: z.string(),
    phone: z.string().min(10, 'Nomor telepon minimal 10 digit'),
    address: z.string().min(1, 'Alamat wajib diisi'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password tidak sama',
    path: ['confirmPassword'],
  });

export async function registerAction(
  state: { error: string | null; success: boolean; pending: boolean },
  formData: FormData
) {
  try {
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      phone: formData.get('phone'),
      address: formData.get('address'),
      confirmPassword: formData.get('confirmPassword'),
    };

    console.log('Registration Data:', {
      name: data.name,
      email: data.email,
      hasPassword: !!data.password,
      phone: data.phone,
      address: data.address,
    });

    const parsedData = registerSchema.safeParse(data);

    if (!parsedData.success) {
      // Format the Zod error messages to be more user-friendly
      const formattedErrors = parsedData.error.format();
      console.log('Validation errors:', formattedErrors);

      // Extract all error messages
      const errorMessages: string[] = [];

      if (formattedErrors.name?._errors) {
        errorMessages.push(formattedErrors.name._errors[0]);
      }

      if (formattedErrors.email?._errors) {
        errorMessages.push(formattedErrors.email._errors[0]);
      }

      if (formattedErrors.password?._errors) {
        errorMessages.push(formattedErrors.password._errors[0]);
      }

      if (formattedErrors.confirmPassword?._errors) {
        errorMessages.push(formattedErrors.confirmPassword._errors[0]);
      }

      if (formattedErrors.phone?._errors) {
        errorMessages.push(formattedErrors.phone._errors[0]);
      }

      if (formattedErrors.address?._errors) {
        errorMessages.push(formattedErrors.address._errors[0]);
      }

      // Join all errors with line breaks for better readability
      const errorMessage = errorMessages.join(' | ');

      return redirect(
        `/register?error=${encodeURIComponent(
          errorMessage || 'Mohon periksa kembali data yang Anda masukkan'
        )}`
      );
    }

    const existingUser = await getUserByEmail(parsedData.data.email as string);
    if (existingUser) {
      return redirect(
        `/register?error=${encodeURIComponent(
          'Email sudah terdaftar. Silakan gunakan email lain atau login dengan email tersebut.'
        )}`
      );
    }

    const customerInput = {
      name: parsedData.data.name,
      email: parsedData.data.email,
      password: parsedData.data.password,
      phone: parsedData.data.phone,
      address: parsedData.data.address,
      role: 'customer',
      dogs: [], // Initialize empty dogs array
      joinDate: new Date().toISOString(),
    };

    await createCustomer(customerInput);

    await redis.del('customers');

    return redirect('/login');
  } catch (error) {
    console.error('Registration error:', error);
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error;
    }
    return redirect(
      `/register?error=${encodeURIComponent(
        'Terjadi kesalahan saat pendaftaran. Silakan coba kembali.'
      )}`
    );
  }
}
