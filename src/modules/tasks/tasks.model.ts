import { ApiProperty } from '@nestjs/swagger';
import { Schema, model } from 'mongoose';

export class Task {
  @ApiProperty()
  _id: string;
  
  @ApiProperty()
  userId: string;
  
  @ApiProperty()
  projectId: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  isDone: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  finishedAt: Date | null;
}

export const TaskSchema = new Schema<Task>({
  title: { type: String, required: true },
  userId: { type: String, required: true },
  projectId: { type: String, required: true },
  isDone: { type: Boolean },
  createdAt: { type: Date },
  finishedAt: { type: Date }
});

export const TaskModel = model<Task>('Task', TaskSchema, 'tasks');