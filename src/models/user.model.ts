import { Document, Model, Schema, model } from 'mongoose';

export interface IUser {
  username: string;
  name?: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserDocument extends IUser, Document {}

const UserSchema = new Schema<IUserDocument>(
  {
    username: { type: String, unique: true, required: true },
    name: { type: String },
    password: { type: String },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } },
);

export const User: Model<IUserDocument> = model('User', UserSchema);
