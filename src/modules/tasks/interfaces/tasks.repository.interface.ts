import { Task } from '../tasks.model';

type Model = Task & { _id: string; };

export interface ITaskRepository {
  insert(params: Pick<Task, 'title' | 'projectId' | 'userId'>): Promise<Model>;
  update(_id: string, projectData: Partial<Task>): Promise<Model>;
  delete(_id: string): Promise<Model>;
  findById(_id: string): Promise<Model | undefined>;
  findAllByProjectId(projectId: string): Promise<Model[]>;
}