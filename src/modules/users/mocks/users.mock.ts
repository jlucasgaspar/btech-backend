import { User } from '../users.model';

type ModelFromDb = User & { _id: string; }

export const userMock: ModelFromDb = {
  _id: 'any_id',
  email: 'any_email@mail.com',
  name: 'any_name',
  password: 'any_password'
}