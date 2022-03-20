import { ApiProperty } from '@nestjs/swagger';
import { Schema, model } from 'mongoose';

export class Project {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
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