import { Document, Model, Schema, model } from 'mongoose';

export interface IBill {
  allocationId: string;
  purchaseId: string;
  saveDate: string;
  dbName: string;

  cottageNumber?: string;
  assignmentId?: string;
  salesmanCode?: string;

  driver: {
    name: string;
    carNumber: string;
  };

  draft: {
    number: string;
    weight: string;
    code: string;
    date: string;
  };

  customer: {
    name: string;
    code: string;
  };

  origin: {
    name: string;
    code: string;
  };

  receiver: {
    name: string;
    postCode: string;
    telephone: string;
    telAddress: string;
    nationalId: string;
  };

  product: {
    name: string;
    unit: string;
    pricePerSale: string;
  };

  bill: {
    id: string;
    row: string;
    number: string;
    serial: string;
    weight: string;
    date: string;
  };

  status: number;
  lastMessage: string;
  account?: string;
  username?: string;
  spsWeight?: string;
  spsDraft?: string;
  merchantWeight: string;

  date: Date;
  created: Date;
}

export interface IBillDocument extends IBill, Document {}

const BillSchema = new Schema<IBillDocument>(
  {
    allocationId: String, //spsId
    purchaseId: String,
    saveDate: String,
    dbName: String, // Origin Sql Database Name That Is Unique

    // The User Doing The Action
    username: String,

    // The Bazargah Account Doing The Action
    account: String,

    merchantWeight: String,
    spsWeight: String,
    spsDraft: String,
    cottageNumber: String,
    assignmentId: String,

    salesmanCode: String,

    driver: {
      name: String,
      carNumber: String,
    },

    draft: {
      number: String,
      weight: String,
      code: String,
      date: String,
    },

    customer: {
      name: String,
      code: String,
    },

    origin: {
      name: String,
      code: String,
    },

    receiver: {
      name: String,
      postCode: String,
      telephone: String,
      telAddress: String,
      nationalId: String,
    },

    product: {
      name: String,
      unit: String,
      pricePerSale: String,
    },

    bill: {
      id: {
        type: String,
        unique: true,
        index: true,
        required: true,
        dropDups: true,
      },
      row: String,
      number: String,
      serial: String,
      weight: String,
      date: String,
    },

    date: { type: Date, required: true },
    created: { type: Date, required: true },
    status: { type: Number, default: -1 },
    lastMessage: { type: String, default: 'بررسی نشده' },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } },
);

export const Bill: Model<IBillDocument> = model<IBillDocument>('Bill', BillSchema);

export interface IBillByDateRequestData{
  startDate:string;
  endDate:string;
}

export interface IBillRequestData {
  _id: string;
  purchaseId: string;
  weight: number;
  accountId: string;
  username: string;
  startDateBill?: string;
  endDateBill?: string;
  startDateSave?: string;
  endDateSave?: string;
  billNumber?: string;
  purchaseNumber?: string;
  status?: string;
  productName?: string;
  sort?: any;
  dbId?: string;
}
