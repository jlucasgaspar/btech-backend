import { IUsersRepository } from '../interfaces/users.repository.interface';
import { User } from '../users.model';

type Model = User & { _id: string; }

export class UsersRepositoryMock implements IUsersRepository {
  private usersDatabase: Model[] = [];

  cleanRepository() {
    return this.usersDatabase = [];
  }

  async insert({ email, name, password, forgotPasswordCode }: User) {
    const data = {
      _id: String(this.usersDatabase.length + 1),
      email,
      name,
      password,
      forgotPasswordCode
    }

    this.usersDatabase.push(data);
    return data;
  }

  async update(_id: string, params: Partial<User>): Promise<Model> {
    let updatedData: Model;

    this.usersDatabase.map(data => {
      if (data._id === _id) {
        updatedData = {
          ...data,
          ...params
        }
        return updatedData;
      } else {
        return data;
      }
    });

    return updatedData;
  }

  async findByEmail(email: string) {
    return this.usersDatabase.find(_ => _.email === email);
  }

  async findByEmailAndReturnPassword(email: string) {
    return this.usersDatabase.find(_ => _.email === email);
  }
}