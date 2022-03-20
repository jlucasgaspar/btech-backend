import * as Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

@JoiSchemaOptions({ allowUnknown: false, abortEarly: false })
export class UpdateProjectDTO {
  @JoiSchema(Joi.string().required())
  _id: string;

  @JoiSchema(Joi.string().optional())
  name: string;
}