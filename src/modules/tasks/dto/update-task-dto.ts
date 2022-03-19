import * as Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

@JoiSchemaOptions({ allowUnknown: false, abortEarly: false })
export class UpdateTasktDTO {
  @JoiSchema(Joi.string().required())
  id: string;

  @JoiSchema(Joi.string().optional())
  title: string;

  @JoiSchema(Joi.boolean().optional())
  isDone: boolean;
}