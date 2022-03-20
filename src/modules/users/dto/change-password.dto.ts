import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

@JoiSchemaOptions({ allowUnknown: false, abortEarly: false })
export class ChangePasswordDTO {
  @JoiSchema(Joi.string().email().required())
  @ApiProperty()
  email: string;
  
  @JoiSchema(Joi.string().required())
  @ApiProperty()
  forgotPasswordCode: string;
  
  @JoiSchema(Joi.string().required())
  @ApiProperty()
  password: string;
  
  @JoiSchema(Joi.string().valid(Joi.ref('password')).required())
  @ApiProperty()
  passwordConfirmation: string;
}