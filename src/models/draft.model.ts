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

export interface IDraftDocument extends IDraft, Document { }
