import { cookies } from "next/headers";
import { sign } from "@/app/utils/jwt";
import { getUserByEmail, registerUserWithGoogle } from "@/app/models/user";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function POST(request: Request) {
  try {
    const { credential } = await request.json();

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return Response.json({ message: "Invalid token" }, { status: 400 });
    }

    const { email, name } = payload;
    let user = await getUserByEmail(email!);

    // If user doesn't exist, register them
    if (!user) {
      await registerUserWithGoogle({
        email: email!,
        name: name!,
      });
      user = await getUserByEmail(email!);
    }

    // Create JWT token
    const token = await sign({
      id: user?._id.toString() ?? "",
      email: user?.email ?? "",
      name: user?.name ?? "",
    });

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
    });

    return Response.json({
      message: "Login successful",
      redirect: "/",
    });
  } catch (error) {
    console.error("Google auth error:", error);
    return Response.json({ message: "Authentication failed" }, { status: 500 });
  }
}
