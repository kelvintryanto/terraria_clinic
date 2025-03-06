import { cookies } from "next/headers";
import { verify } from "@/app/utils/jwt";
import { resetUserPassword, verifyCurrentPassword } from "@/app/models/user";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token?.value) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await verify(token.value);
    if (!user) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    const isValidPassword = await verifyCurrentPassword(user.id, currentPassword);
    if (!isValidPassword) {
      return Response.json({ message: "Current password is incorrect" }, { status: 400 });
    }

    await resetUserPassword(user.id, newPassword);

    return Response.json({
      message: "Password has been changed successfully",
    });
  } catch (error) {
    console.error("Password change failed:", error);
    return Response.json({ message: "Failed to change password" }, { status: 500 });
  }
}
