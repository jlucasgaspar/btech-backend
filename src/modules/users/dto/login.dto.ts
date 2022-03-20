import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';

@JoiSchemaOptions({ allowUnknown: false, abortEarly: false })
export class LoginDTO {
  @JoiSchema(Joi.string().email().required())
  @ApiProperty()
  email: string;

  @JoiSchema(Joi.string().required())
  @ApiProperty()
  password: string;
}