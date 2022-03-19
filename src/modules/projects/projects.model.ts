import { Schema, model } from 'mongoose';

export type Project = {
  name: string;
  userId: string;
  createdAt: Date;
}

const ProjectSchema = new Schema<Project>({
  name: {
    type: String,
    required: [true, 'Name required']
  },
  userId: {
    type: String,
    required: [true, 'User ID required']
  },
  createdAt: {
    type: Date,
    default: new Date()
  }
});

export const ProjectModel = model<Project>('Project', ProjectSchema, 'projects');