import { cookies } from "next/headers";
import { verify } from "@/app/utils/jwt";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token?.value) {
      return Response.json({ user: null });
    }

    const user = await verify(token.value);
    if (!user) {
      return Response.json({ user: null });
    }

    return Response.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Auth check failed:", error);
    return Response.json({ user: null });
  }
}
