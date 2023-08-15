import { Document, Model, Schema, model } from 'mongoose';

export interface IAccount {
  username: string;
  title?: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAccountDocument extends IAccount, Document {}

const AccountSchema = new Schema<IAccountDocument>(
  {
    username: { type: String, unique: true, required: true },
    title: { type: String },
    password: { type: String, required: true },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } },
);

export const Account: Model<IAccountDocument> = model('Account', AccountSchema);

export interface IAccountRequestData {
  body: IAccountDocument;
}
