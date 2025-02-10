import { cookies } from "next/headers";
import { verify } from "./jwt";

export async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  console.log(token, "token di auth");

  if (!token) return null;

  const user = await verify(token?.value);
  return user;
}
