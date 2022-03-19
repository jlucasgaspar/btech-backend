import { Project } from '../projects.model';

type Model = Project & { _id: string; };

export interface IProjectsRepository {
  insert(params: Project): Promise<Model>;
  update(id: string, params: Partial<Pick<Project, 'name' | 'userId'>>): Promise<Model>;
  delete(id: string): Promise<Model>;
  findById(id: string): Promise<Model | undefined>;
  findByUserId(userId: string): Promise<Model[] | undefined>;
  findByUserIdAndName(userId: string, name: string): Promise<Model | undefined>;
}