import { Controller, Post, Body, Get, Headers } from '@nestjs/common';
import { getUserByHeadersToken } from '../../common/utils/getUserByHeadersToken';
import { LoginDTO } from './dto/login-dto';
import { SignUpDTO } from './dto/sign-up-dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService
  ) {}

  @Get('teste')
  async test() {
    return {
      ok: true,
      jwtSecret: process.env.JWT_SECRET,
      databaseUri: process.env.DATABASE_URI
    }
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDTO
  ) {
    return await this.usersService.login(loginDto);
  }

  @Post('signup')
  async signUp(
    @Body() signUpDto: SignUpDTO
  ) {
    return await this.usersService.signUp(signUpDto);
  }

  @Get('me')
  async getMe(@Headers() headers) {
    return await getUserByHeadersToken({ headers });
  }
}