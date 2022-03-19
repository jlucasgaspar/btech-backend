import { JoiPipeModule } from 'nestjs-joi';
import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { TasksModule } from './modules/tasks/tasks.module';

@Module({
  imports: [
    UsersModule,
    ProjectsModule,
    ProjectsModule,
    TasksModule,
    JoiPipeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
