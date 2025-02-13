import { SignJWT, jwtVerify } from "jose";

type JWTPayload = {
  id: string;
  email: string;
  name: string;
  role: string;
};

const getKey = () => {
  const secret = process.env.JWT_SECRET_KEY;
  if (!secret) {
    throw new Error("JWT_SECRET_KEY is not defined in environment variables");
  }
  return new TextEncoder().encode(secret);
};

export async function sign(payload: JWTPayload) {
  const jwt = await new SignJWT(payload).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("24h").sign(getKey());

  return jwt;
}

export async function verify(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getKey());
    return payload as JWTPayload;
  } catch (error) {
    console.error("Failed to verify token:", error);
    return null;
  }
}

export async function decode(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getKey());
    return payload as JWTPayload;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
}
