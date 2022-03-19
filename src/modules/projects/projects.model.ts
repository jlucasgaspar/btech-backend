import { Schema, model } from 'mongoose';

// export type ProjectTask = {
//   name: string;
//   isDone: boolean;
//   createdAt: Date;
// }

export type Project = {
  name: string;
  userId: string;
  // tasks: ProjectTask[];
  createdAt: Date;
}

// export const TaskSchema = new Schema<ProjectTask>({
//   name: { type: String, required: [true, 'Task name required'] },
//   isDone: { type: Boolean, default: false },
//   createdAt: { type: Date, default: new Date() }
// });

const ProjectSchema = new Schema<Project>({
  name: {
    type: String,
    required: [true, 'Name required']
  },
  userId: {
    type: String,
    required: [true, 'User ID required']
  },
  // tasks: [TaskSchema],
  createdAt: {
    type: Date,
    default: new Date()
  }
});

export const ProjectModel = model<Project>('Project', ProjectSchema, 'projects');