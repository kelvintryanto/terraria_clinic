import { registerUser } from "@/app/models/user";

export const POST = async (request: Request) => {
  const body = await request.json();

  await registerUser(body);

  return Response.json({
    status: 201,
    message: "Success Create New User",
  });
};
