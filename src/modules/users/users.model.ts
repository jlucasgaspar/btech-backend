import validator from 'validator';
import { Schema, model } from 'mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class User {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiPropertyOptional()
  forgotPasswordCode?: string;
}

const schema = new Schema<User>({
  name: {
    type: String,
    required: [true, 'Name required']
  },
  password: {
    type: String,
    required: [true, 'Password required']
  },
  forgotPasswordCode: {
    type: String,
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email',
    },
    required: [true, 'Email required']
  },
});

export const UserModel = model('User', schema, 'users');