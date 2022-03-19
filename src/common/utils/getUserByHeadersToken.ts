import { ForbiddenException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserModel } from '../../modules/users/users.model';
import { decodeJwtToken } from './decodeJwtToken';

type Params = {
  headers: { authorization: string; },
  userId?: string;
}

export async function getUserByHeadersToken({ headers, userId }: Params) {
  if (!headers.authorization) {
    throw new UnauthorizedException('Missing JWT.');
  }

  const token = headers.authorization.replace('Bearer ', '');

  const decodedToken = decodeJwtToken(token);

  if (userId && (decodedToken !== userId)) {
    throw new ForbiddenException('Your credentials do not match.');
  }

  const user = await UserModel.findById(decodedToken);

  if (!user) {
    throw new NotFoundException('User not found for this ID.');
  }

  return user;
}