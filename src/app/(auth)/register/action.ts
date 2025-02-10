"use server";

import { getUserByEmail, registerUser } from "@/app/models/user";
import { redirect } from "next/navigation";
import { z } from "zod";

const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(5, "Password must be at least 5 characters"),
    confirmPassword: z.string(),
    phone: z.string().min(10, "Phone number must be at least 10 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export async function registerAction(state: { error: string | null; success: boolean; pending: boolean }, formData: FormData) {
  try {
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      phone: formData.get("phone"),
      confirmPassword: formData.get("confirmPassword"),
    };

    console.log("Registration Data:", {
      name: data.name,
      email: data.email,
      hasPassword: !!data.password,
      phone: data.phone,
    });

    const parsedData = registerSchema.safeParse(data);

    console.log(parsedData.error, "parsedData");

    if (!parsedData.success) {
      return redirect(`/register?error=${encodeURIComponent("Please check your input")}`);
    }

    const existingUser = await getUserByEmail(parsedData.data.email as string);
    if (existingUser) {
      return redirect(`/register?error=${encodeURIComponent("Email already registered")}`);
    }

    await registerUser(parsedData.data);

    return redirect("/login");
  } catch (error) {
    console.error("Registration error:", error);
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }
    return redirect(`/register?error=${encodeURIComponent("Something went wrong during registration")}`);
  }
}
