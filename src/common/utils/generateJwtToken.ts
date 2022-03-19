import * as jwt from 'jsonwebtoken';

const { JWT_SECRET } = process.env;

export function generateJwtToken(userId: string) {
  return jwt.sign(userId, JWT_SECRET);
}