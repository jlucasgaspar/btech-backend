import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ProjectsRepository } from '../projects/projects.repository';
import { CreateTaskDTO } from './dto/create-task.dto';
import { UpdateTasktDTO } from './dto/update-task-dto';
import { TasksRepository } from './tasks.repository';

@Injectable()
export class TasksService {
  constructor(
    private readonly tasksRepository: TasksRepository,
    private readonly projectsRepository: ProjectsRepository
  ) {}

  async create({ title, userId, projectId }: CreateTaskDTO & { userId: string; }) {
    const project = await this.projectsRepository.findById(projectId);

    if (!project) {
      throw new NotFoundException('Project not found.');
    }

    if (project.userId !== userId) {
      throw new BadRequestException('This project does not refer to your userId.');
    }

    return await this.tasksRepository.insert({ title, projectId, userId });
  }

  async update({ _id, title, userId, isDone }: UpdateTasktDTO & { userId: string }) {
    const task = await this.tasksRepository.findById(_id);

    if (!task) {
      throw new NotFoundException('Task not found.');
    }

    if (task.userId !== userId) {
      throw new UnauthorizedException('You can not update this task.');
    }

    if (task.isDone && title) {
      throw new BadRequestException('You can not edit a task that is already done.');
    }

    return await this.tasksRepository.update(_id, { isDone, title });
  }

  async delete(_id: string, userId: string) {
    const task = await this.tasksRepository.findById(_id);

    if (!task) {
      throw new NotFoundException('Task not found.');
    }

    if (task.userId !== userId) {
      throw new UnauthorizedException('You can not update this task.');
    }

    if (task.isDone) {
      throw new BadRequestException('You can not delete a task that is already done.');
    }

    return await this.tasksRepository.delete(_id);
  }

  async getTasksByProject(projectId: string, userId: string) {
    const project = await this.projectsRepository.findById(projectId);
    if (!project) {
      throw new NotFoundException('Project not found.');
    }

    if (project.userId !== userId) {
      throw new UnauthorizedException('You can not see this tasks');
    }

    return await this.tasksRepository.findAllByProjectId(projectId);
  }
}