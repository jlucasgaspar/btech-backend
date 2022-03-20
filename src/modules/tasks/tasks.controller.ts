import { Body, Controller, Delete, Get, Headers, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { getUserByHeadersToken } from '../../common/utils/getUserByHeadersToken';
import { UpdateTasktDTO } from './dto/update-task-dto';
import { CreateTaskDTO } from './dto/create-task.dto';
import { TasksService } from './tasks.service';
import { Task } from './tasks.model';

@Controller('tasks')
@ApiTags('tasks')
@ApiBearerAuth()
export class TasksController {
  constructor(private readonly tasksService: TasksService) { }

  @Post()
  @ApiOperation({ summary: 'Create task' })
  @ApiResponse({ status: 200, description: 'Task created', type: Task })
  async create(
    @Body() createProjectDto: CreateTaskDTO,
    @Headers() headers
  ) {
    const { title, projectId } = createProjectDto;
    const user = await getUserByHeadersToken({ headers });
    return await this.tasksService.create({ title, userId: String(user._id), projectId });
  }

  @Put()
  @ApiOperation({ summary: 'Udate task' })
  @ApiResponse({ status: 200, description: 'Task updated', type: Task })
  async update(
    @Body() updateTaskDTO: UpdateTasktDTO,
    @Headers() headers
  ) {
    const { _id, title, isDone } = updateTaskDTO;
    const user = await getUserByHeadersToken({ headers });
    return await this.tasksService.update({ _id, title, isDone, userId: String(user._id) });
  }

  @Delete(':_id')
  @ApiOperation({ summary: 'Delete task by ID' })
  @ApiResponse({ status: 200, description: 'Task deleted', type: Task })
  async delete(
    @Param('_id') _id: string,
    @Headers() headers
  ) {
    const user = await getUserByHeadersToken({ headers });
    return await this.tasksService.delete(_id, String(user._id));
  }

  @Get(':projectId')
  @ApiOperation({ summary: 'Get all tasks by project ID' })
  @ApiResponse({ status: 200, description: 'Found tasks', type: Task, isArray: true })
  async getByProjectId(
    @Param('projectId') projectId: string,
    @Headers() headers
  ) {
    const user = await getUserByHeadersToken({ headers });
    return await this.tasksService.getTasksByProject(projectId, String(user._id));
  }
}