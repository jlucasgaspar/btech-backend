import { CallHandler, ExecutionContext, Injectable, NestInterceptor, UnauthorizedException } from '@nestjs/common';
import { decodeJwtToken } from '../utils/decodeJwtToken';
import { Request } from 'express';

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const request = context.switchToHttp().getRequest<Request>();

    if (request.url.includes('login') || request.url.includes('signup')) {
      return next.handle();
    }

    const { authorization } = request.headers;

    if (!authorization) {
      throw new UnauthorizedException('Provide an authorization token in headers.');
    }

    if (authorization.trim() === 'Bearer') {
      throw new UnauthorizedException('Provide a JWT token.');
    }

    const token = authorization.replace('Bearer ', '');

    decodeJwtToken(token);

    return next.handle();
  }
}