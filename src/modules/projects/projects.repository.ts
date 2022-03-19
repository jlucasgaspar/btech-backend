import { BadRequestException, Injectable } from '@nestjs/common';
import { Project, ProjectModel } from './projects.model';

@Injectable()
export class ProjectsRepository {
  async insert({ name, userId }: Pick<Project, 'name' | 'userId'>) {
    try {
      return await ProjectModel.create({ name, userId });
    } catch (err) {
      throw new BadRequestException(err.message, err.stack);
    }
  }

  async update(id: string, projectData: Partial<Pick<Project, 'name'>>) {
    try {
      return await ProjectModel.findOneAndUpdate({ _id: id }, { $set: projectData }, { new: true });
    } catch (err) {
      throw new BadRequestException(err.message, err.stack);
    }
  }

  async delete(id: string) {
    try {
      return await ProjectModel.findOneAndDelete({ _id: id });
    } catch (err) {
      throw new BadRequestException(err.message, err.stack);
    }
  }

  async findById(id: string) {
    try {
      return await ProjectModel.findById(id);
    } catch (err) {
      throw new BadRequestException(err.message, err.stack);
    }
  }

  async findByUserId(userId: string) {
    try {
      return await ProjectModel.find({ userId }).sort({ createdAt: -1 });
    } catch (err) {
      throw new BadRequestException(err.message, err.stack);
    }
  }

  async findByUserIdAndName(userId: string, name: string) {
    try {
      return await ProjectModel.findOne({ userId, name });
    } catch (err) {
      throw new BadRequestException(err.message, err.stack);
    }
  }
}