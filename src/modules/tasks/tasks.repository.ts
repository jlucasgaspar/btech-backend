import { BadRequestException, Injectable } from '@nestjs/common';
import { ITaskRepository } from './interfaces/tasks.repository.interface';
import { Task, TaskModel } from './tasks.model';

type Model = Task & { _id: string; };

@Injectable()
export class TasksRepository implements ITaskRepository {
  async insert({ title, projectId, userId }: Pick<Task, 'title' | 'projectId' | 'userId'>): Promise<Model> {
    try {
      const data = await TaskModel.create({ title, projectId, userId })
      return {
        _id: String(data._id),
        projectId: data.projectId,
        userId: data.userId,
        title: data.title,
        isDone: data.isDone,
        finishedAt: data.finishedAt,
        createdAt: data.createdAt,
      }
    } catch (err) {
      throw new BadRequestException(err.message, err.stack);
    }
  }

  async update(_id: string, taskData: Partial<Task>): Promise<Model> {
    try {
      const data = await TaskModel.findOneAndUpdate({
        _id
      }, {
        $set: {
          ...taskData,
          finishedAt: taskData.isDone ? new Date() : null
        }
      }, {
        new: true
      });
      return {
        _id: String(data._id),
        projectId: data.projectId,
        userId: data.userId,
        title: data.title,
        isDone: data.isDone,
        finishedAt: data.finishedAt,
        createdAt: data.createdAt,
      }
    } catch (err) {
      throw new BadRequestException(err.message, err.stack);
    }
  }

  async delete(_id: string): Promise<Model> {
    try {
      const data = await TaskModel.findOneAndDelete({ _id });
      return {
        _id: String(data._id),
        projectId: data.projectId,
        userId: data.userId,
        title: data.title,
        isDone: data.isDone,
        finishedAt: data.finishedAt,
        createdAt: data.createdAt,
      }
    } catch (err) {
      throw new BadRequestException(err.message, err.stack);
    }
  }

  async findById(_id: string): Promise<Model | undefined> {
    try {
      const data = await TaskModel.findById(_id);
      if (!data) return undefined;
      return {
        _id: String(data._id),
        projectId: data.projectId,
        userId: data.userId,
        title: data.title,
        isDone: data.isDone,
        finishedAt: data.finishedAt,
        createdAt: data.createdAt,
      }
    } catch (err) {
      throw new BadRequestException(err.message, err.stack);
    }
  }

  async findAllByProjectId(projectId: string): Promise<Model[]> {
    try {
      const result = await TaskModel.find({ projectId }).sort({ createdAt: -1 });
      return result.map(data => ({
        _id: String(data._id),
        projectId: data.projectId,
        userId: data.userId,
        title: data.title,
        isDone: data.isDone,
        finishedAt: data.finishedAt,
        createdAt: data.createdAt,
      }));
    } catch (err) {
      throw new BadRequestException(err.message, err.stack);
    }
  }
}