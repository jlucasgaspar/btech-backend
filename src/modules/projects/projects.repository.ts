import { BadRequestException, Injectable } from '@nestjs/common';
import { IProjectsRepository } from './interfaces/projects.repository.interface';
import { Project, ProjectModel } from './projects.model';

type Model = Project & { _id: string; }

@Injectable()
export class ProjectsRepository implements IProjectsRepository {
  async insert({ name, userId }: Pick<Project, 'name' | 'userId'>): Promise<Model> {
    try {
      const data = await ProjectModel.create({ name, userId });
      return {
        _id: String(data._id),
        name: data.name,
        userId: data.userId,
        createdAt: data.createdAt
      }
    } catch (err) {
      throw new BadRequestException(err.message, err.stack);
    }
  }

  async update(_id: string, projectData: Partial<Pick<Project, 'name' | 'userId'>>): Promise<Model> {
    try {
      const data = await ProjectModel.findOneAndUpdate({ _id }, { $set: projectData }, { new: true });
      return {
        _id: String(data._id),
        createdAt: data.createdAt,
        name: data.name,
        userId: data.userId
      }
    } catch (err) {
      throw new BadRequestException(err.message, err.stack);
    }
  }

  async delete(_id: string): Promise<Model> {
    try {
      const data = await ProjectModel.findOneAndDelete({ _id });
      return {
        _id: String(data._id),
        createdAt: data.createdAt,
        name: data.name,
        userId: data.userId
      }
    } catch (err) {
      throw new BadRequestException(err.message, err.stack);
    }
  }

  async findById(id: string): Promise<Model | undefined> {
    try {
      const data = await ProjectModel.findById(id);
      if (!data) return undefined;
      return {
        _id: String(data._id),
        createdAt: data.createdAt,
        name: data.name,
        userId: data.userId
      }
    } catch (err) {
      throw new BadRequestException(err.message, err.stack);
    }
  }

  async findByUserId(userId: string): Promise<Model[]> {
    try {
      const data = await ProjectModel.find({ userId }).sort({ createdAt: -1 });
      return data.map(_ => ({
        _id: String(_._id),
        createdAt: _.createdAt,
        name: _.name,
        userId: _.userId
      }));
    } catch (err) {
      throw new BadRequestException(err.message, err.stack);
    }
  }

  async findByUserIdAndName(userId: string, name: string): Promise<Model | undefined> {
    try {
      const data = await ProjectModel.findOne({ userId, name });
      if (!data) return undefined;
      return {
        _id: String(data._id),
        createdAt: data.createdAt,
        name: data.name,
        userId: data.userId
      }
    } catch (err) {
      throw new BadRequestException(err.message, err.stack);
    }
  }
}