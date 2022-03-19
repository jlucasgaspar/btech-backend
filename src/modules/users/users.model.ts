import validator from 'validator';
import { Schema, model } from 'mongoose';

export type User = {
  name: string;
  email: string;
  password: string;
}

const UserSchema = new Schema<User>({
  name: {
    type: String,
    required: [true, 'Name required']
  },
  password: {
    type: String,
    required: [true, 'Password required']
  },
  email: {
    type: String,
    // trim: true,
    lowercase: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email',
      // isAsync: false
    },
    required: [true, 'Email required']
  },
});

export const UserModel = model<User>('User', UserSchema, 'users');