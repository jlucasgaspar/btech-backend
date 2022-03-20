import * as Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import { ApiProperty } from '@nestjs/swagger';

@JoiSchemaOptions({ allowUnknown: false, abortEarly: false })
export class CreateTaskDTO {
  @JoiSchema(Joi.string().required())
  @ApiProperty()
  title: string;
  
  @JoiSchema(Joi.string().required())
  @ApiProperty()
  projectId: string;
}