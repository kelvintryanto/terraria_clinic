"use server";

import { getUserByEmail } from "@/app/models/user";
import { comparePass } from "@/app/utils/bcrypt";
import { sign } from "@/app/utils/jwt";
import { cookies } from "next/headers";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(5, "Password must be at least 5 characters"),
});

interface LoginState {
  error: string | null;
  success: boolean;
  pending: boolean;
  user?: {
    name: string;
    email: string;
  } | null;
  redirect?: string;
}

export async function loginAction(prevState: LoginState, formData: FormData): Promise<LoginState> {
  try {
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    const parsedData = loginSchema.safeParse(data);
    if (!parsedData.success) {
      return {
        error: "Please check your input",
        success: false,
        pending: false,
        user: null,
      };
    }

    const user = await getUserByEmail(parsedData.data.email);
    if (!user || !(await comparePass(parsedData.data.password, user.password))) {
      return {
        error: "Invalid email or password",
        success: false,
        pending: false,
        user: null,
      };
    }

    const token = await sign({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
    });

    return {
      error: null,
      success: true,
      pending: false,
      user: {
        name: user.name,
        email: user.email,
      },
      redirect: ["super_admin", "admin1", "admin2"].includes(user.role) ? "/cms" : "/",
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      error: "Something went wrong during login",
      success: false,
      pending: false,
      user: null,
    };
  }
}
