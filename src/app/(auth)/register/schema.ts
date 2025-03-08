import { z } from 'zod';

export const RegisterSchema = z
  .object({
    name: z.string().min(1, 'Nama lengkap wajib diisi'),
    email: z.string().email('Format email tidak valid'),
    phone: z.string().min(10, 'Nomor telepon minimal 10 digit'),
    password: z.string().min(6, 'Password minimal 6 karakter'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password tidak sama',
    path: ['confirmPassword'],
  });

export type RegisterInput = Omit<
  z.infer<typeof RegisterSchema>,
  'confirmPassword'
>;
