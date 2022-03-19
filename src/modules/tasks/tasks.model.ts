import { Schema, model } from 'mongoose';

export type Task = {
  userId: string;
  projectId: string;
  title: string;
  isDone: boolean;
  createdAt: Date;
  finishedAt: Date | null;
}

export const TaskSchema = new Schema<Task>({
  title: { type: String, required: true },
  userId: { type: String, required: true },
  projectId: { type: String, required: true },
  isDone: { type: Boolean, default: false },
  createdAt: { type: Date, default: new Date() },
  finishedAt: { type: Date, default: null }
});

export const TaskModel = model<Task>('Task', TaskSchema, 'tasks');