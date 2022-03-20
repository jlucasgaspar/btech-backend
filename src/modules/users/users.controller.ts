import { Controller, Post, Body, Get, Headers } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { getUserByHeadersToken } from '../../common/utils/getUserByHeadersToken';
import { ChangePasswordDTO } from './dto/change-password.dto';
import { LoginDTO } from './dto/login.dto';
import { SendForgotPasswordEmailDTO } from './dto/send-forgot-password-email.dto';
import { SignUpDTO } from './dto/sign-up.dto';
import { ChangePasswordSwaggerResponse, GetMeSwaggerResponse, LoginSwaggerResponse, SignUpSwaggerResponse } from './dto/swagger.dto';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'User logged in', type: LoginSwaggerResponse })
  async login(
    @Body() loginDto: LoginDTO
  ) {
    return await this.usersService.login(loginDto);
  }

  @Post('signup')
  @ApiOperation({ summary: 'Signup user' })
  @ApiResponse({ status: 200, description: 'User signed up', type: SignUpSwaggerResponse })
  async signUp(
    @Body() signUpDto: SignUpDTO
  ) {
    return await this.usersService.signUp(signUpDto);
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get me' })
  @ApiResponse({ status: 200, description: 'Found me', type: GetMeSwaggerResponse })
  async getMe(@Headers() headers) {
    return await getUserByHeadersToken({ headers });
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Send forgot password e-mail' })
  @ApiResponse({ status: 200, description: 'E-mail sent', type: Boolean })
  async sendForgotPasswordEmail(
    @Body() { email }: SendForgotPasswordEmailDTO
  ) {
    return await this.usersService.sendForgotPasswordCode({ email });
  }

  @Post('change-password')
  @ApiOperation({ summary: 'Change password after receiving the e-mail' })
  @ApiResponse({ status: 200, description: 'E-mail sent', type: ChangePasswordSwaggerResponse })
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDTO
  ) {
    return await this.usersService.changePassword(changePasswordDto);
  }
}