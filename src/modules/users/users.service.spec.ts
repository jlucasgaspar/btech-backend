import { BadRequestException, NotFoundException } from '@nestjs/common';
import { comparePassword } from '../../common/utils/encrypter';
import { userMock } from './mocks/users.mock';
import { UsersRepositoryMock } from './mocks/users.repository.mock';
import { UsersService } from './users.service';

const usersRepositoryMock = new UsersRepositoryMock();
const sut = new UsersService(usersRepositoryMock);

describe('UsersService', () => {
  beforeEach(() => {
    usersRepositoryMock.cleanRepository();
  });

  describe('signUp', () => {
    it('should throw if the repository finds an e-mail', async () => {
      usersRepositoryMock.insert(userMock);

      expect(sut.signUp({
        email: 'any_email@mail.com',
        name: 'name',
        password: '123456',
        passwordConfirmation: '123456'
      })).rejects.toBeInstanceOf(BadRequestException);
    });

    it('should return an jwt', async () => {
      const result = await sut.signUp({
        email: 'any_email@mail.com',
        name: 'name',
        password: '123456',
        passwordConfirmation: '123456'
      });

      expect(result.jwt).toBeTruthy();
    });
  });

  describe('login', () => {
    it('should throw if the e-mail provided is not found', async () => {
      expect(sut.login({
        email: 'any_email@mail.com',
        password: '123456'
      })).rejects.toBeInstanceOf(NotFoundException);
    });

    it('should throw if the provided password does not match', async () => {
      jest.spyOn(usersRepositoryMock, 'findByEmailAndReturnPassword').mockReturnValueOnce(Promise.resolve(userMock));

      expect(sut.login({
        email: 'any_email@mail.com',
        password: 'wrong_pass'
      })).rejects.toBeInstanceOf(BadRequestException);
    });

    it('should return a jwt', async () => {
      const { user } = await sut.signUp({
        email: 'my_mail@mail.com',
        name: 'name',
        password: '123456',
        passwordConfirmation: '123456'
      });

      const result = await sut.login({
        email: user.email,
        password: '123456'
      });

      expect(result.jwt).toBeTruthy();
    });
  });
});