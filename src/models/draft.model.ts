import { Document, Model, Schema, model } from 'mongoose';

export interface IDraft {
  hamlCode: number;
  hamlCompanyCode: number;
  kotaj: string;
  custCode: string;
  qty: string;
  shipRecno: number;
  shipName: string;
  name: string;
  address: string;
  tel: string;
  postCode: string;
  addressReceive: string;
  meli: string;
  tarekh: string;
  price: string;
  priceFactor: string;
  weight: string;
  trail: boolean;
  send: number;
  recno: string;
  yekta: string;
  bargah: string;
  peygiri: string;
  shenaseh: string;
}

export interface IDraftDocument extends IDraft, Document {}

const DraftSchema = new Schema<IDraftDocument>(
  {
    hamlCode: Number,
    hamlCompanyCode: Number,
    kotaj: String,
    custCode: String,
    qty: String,
    shipRecno: Number,
    shipName: String,
    name: String,
    address: String,
    tel: String,
    postCode: String,
    addressReceive: String,
    meli: String,
    tarekh: String,
    price: String,
    priceFactor: String,
    weight: String,
    trail: Boolean,
    send: Number,
    recno: String,
    yekta: String,
    bargah: String,
    peygiri: String,
    shenaseh: String,
  },
  { timestamps: true }
);

export const Draft: Model<IDraftDocument> = model<IDraftDocument>('Draft', DraftSchema);
