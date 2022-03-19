import { hash, compare } from 'bcrypt';

export async function encryptPassword(password: string) {
  return await hash(password, 12);
}

type CompareParams = {
  hashedPassword: string;
  password: string;
}

export async function comparePassword({ hashedPassword, password }: CompareParams) {
  return await compare(password, hashedPassword);
}