import { BadRequestException, Injectable } from '@nestjs/common';
import { User, UserModel } from './users.model';

@Injectable()
export class UsersRepository {
  async insert({ email, name, password }: User) {
    try {
      return await UserModel.create({ email, name, password });
    } catch (err) {
      throw new BadRequestException(err.message, err.stack);
    }
  }

  async update(id: string, userData: Partial<User>) {
    try {
      const user = await UserModel.findOneAndUpdate({ _id: id }, { $set: userData }, { new: true });
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (err) {
      throw new BadRequestException(err.message, err.stack);
    }
  }

  async delete(id: string) {
    try {
      const user = await UserModel.findOneAndDelete({ _id: id });
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (err) {
      throw new BadRequestException(err.message, err.stack);
    }
  }

  async findById(id: string) {
    try {
      const user = await UserModel.findById(id);
      if (!user) return undefined;
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (err) {
      throw new BadRequestException(err.message, err.stack);
    }
  }

  async findByEmail(email: string) {
    try {
      const user = await UserModel.findOne({ email });
      if (!user) return undefined;
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (err) {
      throw new BadRequestException(err.message, err.stack);
    }
  }

  async findByEmailAndReturnPassword(email: string) {
    try {
      const user = await UserModel.findOne({ email });
      if (!user) return undefined;
      return user;
    } catch (err) {
      throw new BadRequestException(err.message, err.stack);
    }
  }
}