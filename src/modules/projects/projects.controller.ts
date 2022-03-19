import { Body, Controller, Delete, Get, Headers, Param, Post, Put } from '@nestjs/common';
import { getUserByHeadersToken } from 'src/common/utils/getUserByHeadersToken';
import { CreateProjectDTO } from './dto/create-project.dto';
import { UpdateProjectDTO } from './dto/update-project.dto';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor (private readonly projectsService: ProjectsService) {}

  @Post()
  async create(
    @Body() createProjectDto: CreateProjectDTO,
    @Headers() headers
  ) {
    const { name } = createProjectDto;
    const user = await getUserByHeadersToken({ headers });
    return await this.projectsService.create({ name, userId: String(user._id) });
  }

  @Put()
  async update(
    @Body() updateProjectDTO: UpdateProjectDTO,
    @Headers() headers
  ) {
    const { id, name } = updateProjectDTO;
    const user = await getUserByHeadersToken({ headers });
    return await this.projectsService.update({ id, name, userId: String(user._id) });
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @Headers() headers
  ) {
    const user = await getUserByHeadersToken({ headers });
    return await this.projectsService.delete(id, String(user._id));
  }

  @Get(':userId')
  async getByUserId(
    @Param('userId') userId: string,
    @Headers() headers
  ) {
    await getUserByHeadersToken({ headers, userId });
    return await this.projectsService.getProjectsByUser(userId);
  }
}