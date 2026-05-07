import bcrypt from "bcryptjs";
export const hashPassword    = (p: string) => bcrypt.hash(p, 12);
export const comparePassword = (p: string, h: string) => bcrypt.compare(p, h);
