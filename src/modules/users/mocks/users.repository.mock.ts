import { IUsersRepository } from '../interfaces/users.repository.interface';
import { User } from '../users.model';

type Model = User & { _id: string; }

export class UsersRepositoryMock implements IUsersRepository {
  private usersDatabase: Model[] = [];

  cleanRepository() {
    return this.usersDatabase = [];
  }

  async insert({ email, name, password }: User) {
    const data = {
      _id: String(this.usersDatabase.length + 1),
      email,
      name,
      password
    }

    this.usersDatabase.push(data);
    return data;
  }

  async findByEmail(email: string) {
    return this.usersDatabase.find(_ => _.email === email);
  }

  async findByEmailAndReturnPassword(email: string) {
    return this.usersDatabase.find(_ => _.email === email);
  }
}