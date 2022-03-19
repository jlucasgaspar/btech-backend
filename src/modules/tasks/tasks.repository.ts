import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskModel } from './tasks.model';

@Injectable()
export class TasksRepository {
  async insert({ title, projectId, userId }: Pick<Task, 'title' | 'projectId' | 'userId'>) {
    try {
      return await TaskModel.create({ title, projectId, userId })
    } catch (err) {
      throw new BadRequestException(err.message, err.stack);
    }
  }

  async update(id: string, projectData: Partial<Task>) {
    try {
      return await TaskModel.findOneAndUpdate({ _id: id }, { $set: projectData }, { new: true });
    } catch (err) {
      throw new BadRequestException(err.message, err.stack);
    }
  }

  async delete(id: string) {
    try {
      return await TaskModel.findOneAndDelete({ _id: id });
    } catch (err) {
      throw new BadRequestException(err.message, err.stack);
    }
  }

  async findById(id: string) {
    try {
      return await TaskModel.findById(id);
    } catch (err) {
      throw new BadRequestException(err.message, err.stack);
    }
  }

  async findAllByProjectId(projectId: string) {
    try {
      return await TaskModel.find({ projectId }).sort({ createdAt: -1 });;
    } catch (err) {
      throw new BadRequestException(err.message, err.stack);
    }
  }
}