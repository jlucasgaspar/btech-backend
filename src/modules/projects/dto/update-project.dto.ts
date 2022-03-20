import * as Joi from 'joi';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

@JoiSchemaOptions({ allowUnknown: false, abortEarly: false })
export class UpdateProjectDTO {
  @JoiSchema(Joi.string().required())
  @ApiProperty()
  _id: string;

  @JoiSchema(Joi.string().optional())
  @ApiPropertyOptional()
  name: string;
}