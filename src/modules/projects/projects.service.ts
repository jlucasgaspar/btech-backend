import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { TasksRepository } from '../tasks/tasks.repository';
import { CreateProjectDTO } from './dto/create-project.dto';
import { UpdateProjectDTO } from './dto/update-project.dto';
import { ProjectsRepository } from './projects.repository';

@Injectable()
export class ProjectsService {
  constructor (
    private readonly projectsRepository: ProjectsRepository,
    private readonly tasksRepository: TasksRepository
  ) {}

  async create({ name, userId }: CreateProjectDTO & { userId: string; }) {
    const nameExists = await this.projectsRepository.findByUserIdAndName(userId, name);

    if (nameExists) {
      throw new BadRequestException('You already registered a project with this name');
    }

    const project = await this.projectsRepository.insert({ name, userId });
    return { ...project, tasks: [] }
  }

  async update({ id, name, userId }: UpdateProjectDTO & { userId: string }) {
    if (name) {
      const nameExists = await this.projectsRepository.findByUserIdAndName(userId, name);

      if (nameExists && id !== String(nameExists._id)) {
        throw new BadRequestException('You already registered a project with this name');
      }
    }

    const project = await this.projectsRepository.findById(id);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.userId !== userId) {
      throw new UnauthorizedException('You can not update this project');
    }

    const updatedProject = await this.projectsRepository.update(id, { name });
    const tasks = await this.tasksRepository.findAllByProjectId(id);
    return { ...updatedProject, tasks }
  }

  async delete(id: string, userId: string) {
    const project = await this.projectsRepository.findById(id);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.userId !== userId) {
      throw new UnauthorizedException('You can not update this project');
    }

    return await this.projectsRepository.delete(id);
  }

  async getProjectsByUser(userId: string) {
    const projects = await this.projectsRepository.findByUserId(userId);

    const finalResult = [];

    for (const proj of projects) {
      const tasks = await this.tasksRepository.findAllByProjectId(String(proj._id));
      finalResult.push({ ...proj, tasks });
    }
  }
}