import * as Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

@JoiSchemaOptions({ allowUnknown: false, abortEarly: false })
export class CreateTaskDTO {
  @JoiSchema(Joi.string().required())
  title: string;

  @JoiSchema(Joi.string().required())
  projectId: string;
}