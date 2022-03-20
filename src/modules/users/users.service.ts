import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { SendForgotPasswordEmailDTO } from './dto/send-forgot-password-email.dto';
import { ChangePasswordDTO } from './dto/change-password.dto';
import { SignUpDTO } from './dto/sign-up.dto';
import { LoginDTO } from './dto/login.dto';
import { generate6DigitsPasswordCode } from '../../common/utils/generate6DigitsPasswordCode';
import { sendForgotPasswordEmail } from '../../common/utils/sendForgotPasswordEmail';
import { comparePassword, encryptPassword } from '../../common/utils/encrypter';
import { generateJwtToken } from '../../common/utils/generateJwtToken';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository
  ) { }

  async signUp({ email, password, name }: SignUpDTO) {
    const hasEmail = await this.usersRepository.findByEmail(email);
    if (hasEmail) {
      throw new BadRequestException(`E-mail ${email} already exists.`);
    }

    const hashedPassword = await encryptPassword(password);

    const user = await this.usersRepository.insert({ email, password: hashedPassword, name });

    return { user, jwt: generateJwtToken(`${user._id}`) }
  }

  async login({ email, password }: LoginDTO) {
    const foundUser = await this.usersRepository.findByEmailAndReturnPassword(email);
    if (!foundUser) {
      throw new NotFoundException(`User with e-mail ${email} not found.`);
    }

    const passwordIsValid = await comparePassword({ hashedPassword: foundUser.password, password });

    if (!passwordIsValid) {
      throw new BadRequestException('Wrong(s) email/password.');
    }

    return {
      user: foundUser,
      jwt: generateJwtToken(`${foundUser._id}`)
    }
  }

  async sendForgotPasswordCode({ email }: SendForgotPasswordEmailDTO) {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundException(`User with e-mail ${email} not found.`);
    }

    const code = generate6DigitsPasswordCode();

    await this.usersRepository.update(user._id, { forgotPasswordCode: code });

    return await sendForgotPasswordEmail({ code, to: email, userName: user.name });
  }

  async changePassword({ email, forgotPasswordCode, password }: ChangePasswordDTO) {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundException(`User with e-mail ${email} not found.`);
    }

    if (user.forgotPasswordCode !== forgotPasswordCode) {
      throw new BadRequestException('Invalid code.');
    }

    const newPassword = await encryptPassword(password);

    await this.usersRepository.update(user._id, { forgotPasswordCode: null, password: newPassword });

    return { user, jwt: generateJwtToken(`${user._id}`) }
  }
}