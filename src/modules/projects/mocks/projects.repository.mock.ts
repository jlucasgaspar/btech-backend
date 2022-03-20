import { IProjectsRepository } from '../interfaces/projects.repository.interface';
import { Project } from '../projects.model';

type Model = Project & { _id: string; }

export class ProjectsRepositoryMock implements IProjectsRepository {
  projectsDatabase: Model[] = [];

  cleanRepository() {
    return this.projectsDatabase = [];
  }

  async insert(params: Project): Promise<Model> {
    const data = {
      ...params,
      _id: String(this.projectsDatabase.length + 1),
      createdAt: new Date()
    }

    this.projectsDatabase.push(data);
    return data;
  }

  async update(_id: string, params: Partial<Pick<Project, 'name' | 'userId'>>): Promise<Model> {
    let updatedData: Model;

    this.projectsDatabase.map(data => {
      if (data._id === _id) {
        updatedData = { ...data, ...params }
        return updatedData;
      } else {
        return data;
      }
    });

    return updatedData;
  }

  async delete(_id: string): Promise<Model> {
    let deletedData: Model;

    this.projectsDatabase = this.projectsDatabase.filter(data => {
      if (data._id === _id) {
        deletedData = data
        return false;
      } else {
        return true;
      }
    });

    return deletedData;
  }

  async findById(_id: string): Promise<Model | undefined> {
    return this.projectsDatabase.find(_ => _._id === _id);
  }

  async findByUserId(userId: string): Promise<Model[]> {
    return this.projectsDatabase.filter(_ => _.userId === userId);
  }

  async findByUserIdAndName(userId: string, name: string): Promise<Model | undefined> {
    return this.projectsDatabase.find(_ => _.userId === userId && _.name === name);
  }
}