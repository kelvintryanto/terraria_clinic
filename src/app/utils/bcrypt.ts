import bcrypt from "bcryptjs";

export const hashPass = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePass = async (password: string, hashedPassword: string) => {
  return bcrypt.compare(password, hashedPassword);
};
