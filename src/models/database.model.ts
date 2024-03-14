import { Document, Model, Schema, model } from 'mongoose'

export interface IDatabase {
  name: string
  title?: string
  username: string
  password: string
  address: string
  proc: string
  isShamsi: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface IDatabaseDocument extends IDatabase, Document {}

const DatabaseSchema = new Schema<IDatabaseDocument>(
  {
    name: { type: String, required: true },
    title: { type: String, unique:true },
    username: { type: String, required: true },
    password: { type: String },
    address: { type: String, required: true },
    proc: { type: String, required: true },
    isShamsi: { type: Boolean, required: true },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } },
)

export const Database: Model<IDatabaseDocument> = model('Database', DatabaseSchema)
