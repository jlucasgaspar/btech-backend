import { BadRequestException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

const { JWT_SECRET } = process.env;

export function decodeJwtToken(token: string) {
  const verifiedToken = jwt.verify(token, JWT_SECRET);

  if (!verifiedToken) {
    throw new BadRequestException('JWT malformed.');
  }

  const decodedToken = jwt.decode(token);

  if (!decodedToken) {
    throw new BadRequestException('Wrong JWT.');
  }

  return decodedToken;
}