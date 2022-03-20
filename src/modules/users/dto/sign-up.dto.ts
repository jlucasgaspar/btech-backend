import * as Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

@JoiSchemaOptions({ allowUnknown: false, abortEarly: false })
export class SignUpDTO {
  @JoiSchema(Joi.string().required())
  name: string;

  @JoiSchema(Joi.string().email().required())
  email: string;

  @JoiSchema(Joi.string().required())
  password: string;

  @JoiSchema(Joi.string().valid(Joi.ref('password')).required())
  passwordConfirmation: string;
}