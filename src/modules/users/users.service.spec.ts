import { BadRequestException, NotFoundException } from '@nestjs/common';
import * as emailUtil  from '../../common/utils/sendForgotPasswordEmail';
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

  describe('sendForgotPasswordCode', () => {
    it('should throw if the provided e-mail is not found', async () => {
      expect(sut.sendForgotPasswordCode({
        email: 'unkown_email@mail.com'
      })).rejects.toBeInstanceOf(NotFoundException);
    });

    it('should update the forgotPasswordCode of the user', async () => {
      const email = 'any_email@email.com';

      await usersRepositoryMock.insert({
        email,
        name: 'any_name',
        password: 'any_password'
      });

      jest.spyOn(emailUtil, 'sendForgotPasswordEmail').mockImplementationOnce(() => Promise.resolve(true));
      const updateRespositorySpy = jest.spyOn(usersRepositoryMock, 'update');

      await sut.sendForgotPasswordCode({ email });

      expect(updateRespositorySpy).toHaveBeenCalled();
    });
  });

  describe('changePassword', () => {
    it('should throw if the provided e-mail is not found', async () => {
      expect(sut.changePassword({
        email: 'unkown_email@mail.com',
        forgotPasswordCode: '123456',
        password: 'password',
        passwordConfirmation: 'password'
      })).rejects.toBeInstanceOf(NotFoundException);
    });

    it('should throw if the provided forgotPasswordCode is wrong', async () => {
      const email = 'any_email@email.com';

      await usersRepositoryMock.insert({
        email,
        name: 'any_name',
        password: 'any_password',
        forgotPasswordCode: '111111'
      });

      expect(sut.changePassword({
        email,
        forgotPasswordCode: 'wrong_password_code',
        password: 'password',
        passwordConfirmation: 'password'
      })).rejects.toBeInstanceOf(BadRequestException);
    });

    it('should update the password', async () => {
      const email = 'any_email@email.com';
      const forgotPasswordCode = '123456';

      await usersRepositoryMock.insert({
        email,
        forgotPasswordCode,
        name: 'any_name',
        password: 'any_password'
      });

      jest.spyOn(emailUtil, 'sendForgotPasswordEmail').mockImplementationOnce(() => Promise.resolve(true));
      const updateRespositorySpy = jest.spyOn(usersRepositoryMock, 'update');

      await sut.changePassword({ email, forgotPasswordCode, password: 'new_password', passwordConfirmation: 'new_password' });

      expect(updateRespositorySpy).toHaveBeenCalled();
    });
  });
});