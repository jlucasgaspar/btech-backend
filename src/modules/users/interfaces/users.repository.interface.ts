import { User } from '../users.model';

type Model = User & { _id: string; };

export interface IUsersRepository {
  insert(params: User): Promise<Omit<Model, 'password'>>;
  update(_id: string, userData: Partial<User>): Promise<Omit<Model, 'password'>>;
  findByEmail(email: string): Promise<Omit<Model, 'password'> | undefined>;
  findByEmailAndReturnPassword(email: string): Promise<Model | undefined>;
}