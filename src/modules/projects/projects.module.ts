import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { ProjectsRepository } from './projects.repository';
import { TasksRepository } from '../tasks/tasks.repository';

@Module({
  providers: [ProjectsService, ProjectsRepository, TasksRepository],
  controllers: [ProjectsController],
})
export class ProjectsModule { }