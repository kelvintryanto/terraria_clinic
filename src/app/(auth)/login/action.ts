"use server";

import { getUserByEmail } from "@/app/models/user";
import { comparePass } from "@/app/utils/bcrypt";
import { sign } from "@/app/utils/jwt";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(5, "Password must be at least 5 characters"),
});

export async function loginAction(state: { error: string | null; success: boolean; pending: boolean }, formData: FormData) {
  try {
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    console.log("Login attempt for:", data.email);

    const parsedData = loginSchema.safeParse(data);
    if (!parsedData.success) {
      return redirect(`/login?error=${encodeURIComponent("Please check your input")}`);
    }

    const user = await getUserByEmail(parsedData.data.email);
    if (!user || !(await comparePass(parsedData.data.password, user.password))) {
      return redirect(`/login?error=${encodeURIComponent("Invalid credentials")}`);
    }

    const token = await sign({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
    });

    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
    });

    redirect("/booking");
  } catch (error) {
    console.error("Login error:", error);
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }
    return redirect(`/login?error=${encodeURIComponent("Something went wrong during login")}`);
  }
}
