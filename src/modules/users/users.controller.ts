import { Controller, Post, Body, Get, Headers } from '@nestjs/common';
import { getUserByHeadersToken } from '../../common/utils/getUserByHeadersToken';
import { ChangePasswordDTO } from './dto/change-password.dto';
import { LoginDTO } from './dto/login.dto';
import { SendForgotPasswordEmailDTO } from './dto/send-forgot-password-email.dto';
import { SignUpDTO } from './dto/sign-up.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService
  ) {}

  @Post('public/login')
  async login(
    @Body() loginDto: LoginDTO
  ) {
    return await this.usersService.login(loginDto);
  }

  @Post('public/signup')
  async signUp(
    @Body() signUpDto: SignUpDTO
  ) {
    return await this.usersService.signUp(signUpDto);
  }

  @Get('me')
  async getMe(@Headers() headers) {
    return await getUserByHeadersToken({ headers });
  }

  @Post('public/forgot-password')
  async sendForgotPasswordEmail(
    @Body() { email }: SendForgotPasswordEmailDTO
  ) {
    return await this.usersService.sendForgotPasswordCode({ email });
  }

  @Post('public/change-password')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDTO
  ) {
    // return await this.usersService.
  }
}