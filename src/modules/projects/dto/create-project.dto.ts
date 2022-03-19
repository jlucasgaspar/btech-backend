import * as Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

@JoiSchemaOptions({ allowUnknown: false, abortEarly: false })
export class CreateProjectDTO {
  @JoiSchema(Joi.string().required())
  name: string;
}