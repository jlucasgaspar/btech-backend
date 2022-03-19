import { BadRequestException, Injectable } from '@nestjs/common';
import { IUsersRepository } from './interfaces/users.repository.interface';
import { User, UserModel } from './users.model';

type Model = User & { _id: string; }

@Injectable()
export class UsersRepository implements IUsersRepository {
  async insert({ email, name, password }: User): Promise<Omit<Model, 'password'>> {
    try {
      const result = await UserModel.create({ email, name, password });
      return {
        _id: String(result._id),
        email: result.email,
        name: result.name
      }
    } catch (err) {
      throw new BadRequestException(err.message, err.stack);
    }
  }

  async findByEmail(email: string): Promise<Omit<Model, 'password'>> {
    try {
      const user = await UserModel.findOne({ email });
      if (!user) return undefined;
      return {
        _id: String(user._id),
        email: user.email,
        name: user.name
      }
    } catch (err) {
      throw new BadRequestException(err.message, err.stack);
    }
  }

  async findByEmailAndReturnPassword(email: string): Promise<Model> {
    try {
      const user = await UserModel.findOne({ email });
      if (!user) return undefined;
      return {
        _id: String(user._id),
        email: user.email,
        name: user.name,
        password: user.password
      }
    } catch (err) {
      throw new BadRequestException(err.message, err.stack);
    }
  }
}