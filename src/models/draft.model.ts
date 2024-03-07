import { Document, Model, Schema, model } from 'mongoose';

export interface IDraft {
  hamlCode: number;
  hamlCompanyCode: number;
  kotaj: string;
  custCode: string;
  qty: number;
  shipRecno: number;
  shipName: string;
  name: string;
  address: string;
  tel: string;
  postCode: string;
  addressReceive: string;
  meli: string;
  tarekh: string;
  price: number;
  priceFactor: number;
  weight: string;
  trail: boolean;
  send: number;
  recno: number;
  yekta: string;
  bargah: string;
  peygiri: number;
  shenaseh: string;
  status: number;
  code: number;
}

export interface IDraftDocument extends IDraft, Document {}

const DraftSchema = new Schema<IDraftDocument>(
  {
    hamlCode: Number,
    hamlCompanyCode: Number,
    kotaj: String,
    custCode: String,
    qty: Number,
    shipRecno: Number,
    shipName: String,
    name: String,
    address: String,
    tel: String,
    postCode: String,
    addressReceive: String,
    meli: String,
    tarekh: String,
    price: Number,
    priceFactor: Number,
    weight: String,
    trail: Boolean,
    send: Number,
    recno: Number,
    yekta: String,
    bargah: String,
    peygiri: Number,
    shenaseh: String,
    status: Number,
    code: Number,
  },
  { timestamps: true }
);

export const Draft: Model<IDraftDocument> = model<IDraftDocument>('Draft', DraftSchema);
