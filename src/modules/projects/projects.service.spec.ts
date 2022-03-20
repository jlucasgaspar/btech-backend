import { BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { TasksRepositoryMock } from '../tasks/mocks/tasks.repository.mock';
import { ProjectsRepositoryMock } from './mocks/projects.repository.mock';
import { ProjectsService } from './projects.service';

const projectsRepositoryMock = new ProjectsRepositoryMock();
const taksRepositoryMock = new TasksRepositoryMock();
const sut = new ProjectsService(projectsRepositoryMock, taksRepositoryMock);

describe('ProjectsService', () => {
  beforeEach(() => {
    projectsRepositoryMock.cleanRepository();
    taksRepositoryMock.cleanRepository();
  });

  describe('create', () => {
    it('should throw if the project name already exists', async () => {
      await sut.create({ name: 'any_name', userId: 'any_user_id' });
      expect(sut.create({
        name: 'any_name',
        userId: 'any_user_id'
      })).rejects.toBeInstanceOf(BadRequestException);
    });

    it('should create the project', async () => {
      const result = await sut.create({ name: 'any_name', userId: 'any_user_id' });
      expect(result._id).toBeTruthy();
    });
  });

  describe('update', () => {
    it('should throw if the project name already exists', async () => {
      const project = await sut.create({ name: 'any_name', userId: 'any_user_id' });
      const project_2 = await sut.create({ name: 'any_name_2', userId: 'any_user_id' });

      expect(sut.update({
        _id: project._id,
        name: project_2.name,
        userId: project.userId
      })).rejects.toBeInstanceOf(BadRequestException);
    });

    it('should throw if the project is not found', async () => {
      expect(sut.update({
        _id: 'non_existing_id',
        name: 'any_name',
        userId: 'any_user_id'
      })).rejects.toBeInstanceOf(NotFoundException);
    });

    it('should throw if the project userId is different of the request user ID', async () => {
      const result = await sut.create({
        name: 'any_name',
        userId: 'any_user_id'
      });

      expect(sut.update({
        _id: result._id,
        name: 'any_name_new',
        userId: 'different_user_id'
      })).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('should update correctly', async () => {
      const result = await sut.create({
        name: 'any_name',
        userId: 'any_user_id'
      });

      const updatedResult = await sut.update({
        _id: result._id,
        name: 'any_name_new',
        userId: 'any_user_id'
      });

      expect(updatedResult.name).toEqual('any_name_new');
    });
  });

  describe('delete', () => {
    it('should throw if the project is not found', async () => {
      expect(sut.delete('any_wrong_id', 'any_user_id')).rejects.toBeInstanceOf(NotFoundException);
    });

    it('should throw if the project userId is different of request user ID', async () => {
      const { _id } = await sut.create({
        name: 'any_name',
        userId: 'any_user_id'
      });

      expect(sut.delete(_id, 'wrong_user_id')).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('should delete', async () => {
      const { _id, userId } = await sut.create({
        name: 'any_name',
        userId: 'any_user_id'
      });

      await sut.delete(_id, userId);
      expect(projectsRepositoryMock.projectsDatabase.length).toEqual(0);
    });
  });

  describe('getProjectsByUser', () => {
    it('should return only the projects of an user', async () => {
      await sut.create({ name: 'name_1', userId: 'user_1' });
      await sut.create({ name: 'name_2', userId: 'user_1' });
      await sut.create({ name: 'name_1', userId: 'user_2' });
      await sut.create({ name: 'name_2', userId: 'user_2' });

      const result = await sut.getProjectsByUser('user_1');
      expect(result.length).toEqual(2);
    });
  });
});