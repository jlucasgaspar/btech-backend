import { ITaskRepository } from '../interfaces/tasks.repository.interface';
import { Task } from '../tasks.model';

type Model = Task & { _id: string; }

export class TasksRepositoryMock implements ITaskRepository {
  private tasksDatabase: Model[] = [];

  cleanRepository() {
    return this.tasksDatabase = [];
  }

  async insert(params: Task): Promise<Model> {
    const data = {
      ...params,
      _id: String(this.tasksDatabase.length + 1),
      createdAt: new Date()
    }

    this.tasksDatabase.push(data);
    return data;
  }

  async update(_id: string, params: Partial<Task>): Promise<Task & { _id: string; }> {
    let updatedData: Model;
  
    this.tasksDatabase.map(data => {
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

    this.tasksDatabase = this.tasksDatabase.filter(data => {
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
    return this.tasksDatabase.find(_ => _._id === _id);
  }

  async findAllByProjectId(projectId: string): Promise<Model[]> {
    return this.tasksDatabase.filter(_ => _.projectId === projectId);
  }
}