import { Body, Controller, Delete, Get, Headers, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { getUserByHeadersToken } from '../../common/utils/getUserByHeadersToken';
import { CreateProjectDTO } from './dto/create-project.dto';
import { UpdateProjectDTO } from './dto/update-project.dto';
import { ProjectsService } from './projects.service';
import { Project } from './projects.model';

@Controller('projects')
@ApiTags('projects')
@ApiBearerAuth()
export class ProjectsController {
  constructor (private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiOperation({ summary: 'Create project' })
  @ApiResponse({ status: 200, description: 'Project created', type: Project })
  async create(
    @Body() createProjectDto: CreateProjectDTO,
    @Headers() headers
  ) {
    const { name } = createProjectDto;
    const user = await getUserByHeadersToken({ headers });
    return await this.projectsService.create({ name, userId: String(user._id) });
  }

  @Put()
  @ApiOperation({ summary: 'Update project' })
  @ApiResponse({ status: 200, description: 'Project updated', type: Project })
  async update(
    @Body() updateProjectDTO: UpdateProjectDTO,
    @Headers() headers
  ) {
    const { _id, name } = updateProjectDTO;
    const user = await getUserByHeadersToken({ headers });
    return await this.projectsService.update({ _id, name, userId: String(user._id) });
  }

  @Delete(':_id')
  @ApiOperation({ summary: 'Delete peoject by ID' })
  @ApiResponse({ status: 200, description: 'Project deleted', type: Project })
  async delete(
    @Param('_id') _id: string,
    @Headers() headers
  ) {
    const user = await getUserByHeadersToken({ headers });
    return await this.projectsService.delete(_id, String(user._id));
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get all projects by project ID' })
  @ApiResponse({ status: 200, description: 'Found projects', type: Project, isArray: true })
  async getByUserId(
    @Param('userId') userId: string,
    @Headers() headers
  ) {
    await getUserByHeadersToken({ headers, userId });
    return await this.projectsService.getProjectsByUser(userId);
  }
}