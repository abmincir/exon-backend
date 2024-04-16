import { Document, Model, Schema, model } from 'mongoose';

export interface IDraft {
  code:number;
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
  weight: number;
  trail: boolean;
  send: number;
  recno: number;
  yekta: number;
  bargah: number;
  peygiri: number;
  shenaseh: number;
  customerName:string;

  status: string;
  lastMessage?: string;
}

export interface IDraftDocument extends IDraft, Document {}

const DraftSchema = new Schema<IDraftDocument>(
  {
    code: Number,
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
    weight: Number,
    trail: Boolean,
    send: Number,
    recno: Number,
    yekta: Number,
    bargah: Number,
    peygiri: Number,
    shenaseh: Number,
    customerName: String,

    status: { type: String, default: 'unknown' },
    lastMessage: { type: String, default: 'بررسی نشده' },
  },
  { timestamps: true }
);

export const Draft: Model<IDraftDocument> = model<IDraftDocument>('Draft', DraftSchema);
