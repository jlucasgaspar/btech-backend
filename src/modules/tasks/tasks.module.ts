import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TasksRepository } from './tasks.repository';
import { ProjectsRepository } from '../projects/projects.repository';

@Module({
  providers: [TasksService, TasksRepository, ProjectsRepository],
  controllers: [TasksController],
})
export class TasksModule {}