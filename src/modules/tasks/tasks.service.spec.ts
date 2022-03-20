
import { BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ProjectsRepositoryMock } from '../projects/mocks/projects.repository.mock';
import { ProjectsService } from '../projects/projects.service';
import { TasksRepositoryMock } from './mocks/tasks.repository.mock';
import { TasksService } from './tasks.service';

const projectsRepositoryMock = new ProjectsRepositoryMock();
const tasksRepositoryMock = new TasksRepositoryMock();
const projectsService = new ProjectsService(projectsRepositoryMock, tasksRepositoryMock);
const sut = new TasksService(tasksRepositoryMock, projectsRepositoryMock);

describe('TasksService', () => {
  beforeEach(() => {
    projectsRepositoryMock.cleanRepository();
    tasksRepositoryMock.cleanRepository();
  });

  describe('create', () => {
    it('should throw if the provided "projectId" is not found', async () => {
      expect(sut.create({
        projectId: 'unexisting_project_id',
        title: 'any_title',
        userId: 'any_user_id'
      })).rejects.toBeInstanceOf(NotFoundException);
    });

    it('should throw if the provided "userId" does not match with the project "userId"', async () => {
      const { _id } = await projectsService.create({
        name: 'any_project_name',
        userId: 'any_user_id'
      });

      expect(sut.create({
        projectId: _id,
        title: 'any_title',
        userId: 'wrong_user_id'
      })).rejects.toBeInstanceOf(BadRequestException);
    });

    it('should create the task', async () => {
      const { _id, userId } = await projectsService.create({
        name: 'any_project_name',
        userId: 'any_user_id'
      });

      const task = await sut.create({
        projectId: _id,
        title: 'any_title',
        userId: userId
      });

      expect(task._id).toBeTruthy();
    });
  });

  describe('update', () => {
    it('should throw if the task is not found', async () => {
      expect(sut.update({
        _id: 'unexisting_task_id',
        isDone: true,
        title: 'any_title',
        userId: 'any_user_id'
      })).rejects.toBeInstanceOf(NotFoundException);
    });

    it('should throw if the provided "userId" does not match tha task "userId"', async () => {
      const project = await projectsService.create({
        name: 'any_project_name',
        userId: 'any_user_id'
      });
      const task = await sut.create({
        projectId: project._id,
        title: 'any_task_title',
        userId: project.userId
      });
      expect(sut.update({
        _id: task._id,
        isDone: true,
        title: 'any_title',
        userId: 'wrong_user_id'
      })).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('should throw if the task is already done', async () => {
      const project = await projectsService.create({
        name: 'any_project_name',
        userId: 'any_user_id'
      });
      jest.spyOn(tasksRepositoryMock, 'findById').mockReturnValueOnce(Promise.resolve({
        _id: 'any_task_id',
        title: 'any_title',
        isDone: true,
        userId: project.userId,
        projectId: project._id,
        createdAt: new Date(),
        finishedAt: new Date()
      }));
      expect(sut.update({
        _id: 'any_task_id',
        title: 'any_new_task_title',
        userId: project.userId
      })).rejects.toBeInstanceOf(BadRequestException);
    });

    it('should update the task', async () => {
      const project = await projectsService.create({
        name: 'any_project_name',
        userId: 'any_user_id'
      });
      const task = await sut.create({
        projectId: project._id,
        title: 'any_task_title',
        userId: project.userId
      });
      const updatedTask = await sut.update({
        title: 'new_task_title',
        userId: project.userId,
        isDone: true,
        _id: task._id
      });
      expect(updatedTask.title).toEqual('new_task_title');
      expect(updatedTask.isDone).toEqual(true);
      expect(updatedTask.finishedAt).toBeTruthy();
    });
  });

  describe('delete', () => {
    it('should throw if the task is not found', async () => {
      expect(sut.delete('unexisting_task_id', 'any_user_id')).rejects.toBeInstanceOf(NotFoundException);
    });

    it('should throw if the provided "userId" does not match tha task "userId"', async () => {
      const project = await projectsService.create({
        name: 'any_project_name',
        userId: 'any_user_id'
      });
      const task = await sut.create({
        projectId: project._id,
        title: 'any_task_title',
        userId: project.userId
      });
      expect(sut.delete(task._id, 'wrong_user_id')).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('should throw if the task is already done', async () => {
      const project = await projectsService.create({
        name: 'any_project_name',
        userId: 'any_user_id'
      });
      jest.spyOn(tasksRepositoryMock, 'findById').mockReturnValueOnce(Promise.resolve({
        _id: 'any_task_id',
        title: 'any_title',
        isDone: true,
        userId: project.userId,
        projectId: project._id,
        createdAt: new Date(),
        finishedAt: new Date()
      }));
      expect(sut.delete('any_task_id', project.userId)).rejects.toBeInstanceOf(BadRequestException);
    });

    it('should delete the task', async () => {
      const project = await projectsService.create({
        name: 'any_project_name',
        userId: 'any_user_id'
      });
      const task = await sut.create({
        projectId: project._id,
        title: 'any_task_title',
        userId: project.userId
      });
      await sut.delete(task._id, task.userId);
      expect(tasksRepositoryMock.tasksDatabase.length).toEqual(0);
    });
  });

  describe('getTasksByProject', () => {
    it('should throw if the project is not found', async () => {
      expect(
        sut.getTasksByProject('wrong_project_id', 'wrong_user_id')
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('should throw if the provided "userId" does not match with project "userId"', async () => {
      const project = await projectsService.create({
        name: 'any_project_name',
        userId: 'any_user_id'
      });
      expect(
        sut.getTasksByProject(project._id, 'wrong_user_id')
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('should return only the tasks of one project', async () => {
      const userId = 'any_user_id';

      const project_1 = await projectsService.create({ name: 'project_1_name', userId });
      const project_2 = await projectsService.create({ name: 'project_2_name', userId });

      await sut.create({ title: 'any_title', projectId: project_1._id, userId });
      await sut.create({ title: 'any_title', projectId: project_1._id, userId });
      await sut.create({ title: 'any_title', projectId: project_2._id, userId });
      await sut.create({ title: 'any_title', projectId: project_2._id, userId });

      const result = await sut.getTasksByProject(project_1._id, userId);
      expect(result.length).toEqual(2);
    });
  });
});