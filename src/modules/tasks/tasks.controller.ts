import { Body, Controller, Delete, Get, Headers, Param, Post, Put } from '@nestjs/common';
import { getUserByHeadersToken } from 'src/common/utils/getUserByHeadersToken';
import { UpdateTasktDTO } from './dto/update-task-dto';
import { CreateTaskDTO } from './dto/create-task.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) { }

  @Post()
  async create(
    @Body() createProjectDto: CreateTaskDTO,
    @Headers() headers
  ) {
    const { title, projectId } = createProjectDto;
    const user = await getUserByHeadersToken({ headers });
    return await this.tasksService.create({ title, userId: String(user._id), projectId });
  }

  @Put()
  async update(
    @Body() updateTaskDTO: UpdateTasktDTO,
    @Headers() headers
  ) {
    const { id, title, isDone } = updateTaskDTO;
    const user = await getUserByHeadersToken({ headers });
    return await this.tasksService.update({ id, title, isDone, userId: String(user._id) });
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @Headers() headers
  ) {
    const user = await getUserByHeadersToken({ headers });
    return await this.tasksService.delete(id, String(user._id));
  }

  @Get(':projectId')
  async getByProjectId(
    @Param('projectId') projectId: string,
    @Headers() headers
  ) {
    const user = await getUserByHeadersToken({ headers });
    return await this.tasksService.getTasksByProject(projectId, String(user._id));
  }
}