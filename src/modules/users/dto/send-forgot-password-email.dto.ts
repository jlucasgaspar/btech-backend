import * as Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

@JoiSchemaOptions({ allowUnknown: false, abortEarly: false })
export class SendForgotPasswordEmailDTO {
  @JoiSchema(Joi.string().email().required())
  email: string;
}