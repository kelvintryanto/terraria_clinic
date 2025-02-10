import bcrypt from "bcryptjs";
export const hashPass = (password: string) => {
  const salt = 10;
  return bcrypt.hash(password, salt);
};

export const comparePass = (password: string, hashPass: string) => {
  return bcrypt.compare(password, hashPass);
};
