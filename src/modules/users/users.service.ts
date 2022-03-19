import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { comparePassword, encryptPassword } from 'src/common/utils/encrypter';
import { generateJwtToken } from 'src/common/utils/generateJwtToken';
import { UsersRepository } from './users.repository';
import { SignUpDTO } from './dto/sign-up-dto';
import { LoginDTO } from './dto/login-dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository
  ) {}

  async signUp({ email, password, name }: SignUpDTO) {
    const hasEmail = await this.usersRepository.findByEmail(email);
    if (hasEmail) {
      throw new NotFoundException(`E-mail ${email} already exists.`);
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
}