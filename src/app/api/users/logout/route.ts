import { cookies } from "next/headers";

export const POST = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("token");

  return Response.json({
    status: 200,
    message: "Logout successful",
  });
};
