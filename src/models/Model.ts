const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BillSchema = new Schema(
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
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

exports.Bill = mongoose.model('Bill', BillSchema);

const UserSchema = new Schema(
  {
    username: { type: String, unique: true, required: true },
    name: { type: String },
    password: { type: String },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

exports.User = mongoose.model('User', UserSchema);

const AccountSchema = new Schema(
  {
    username: { type: String, unique: true, required: true },
    title: { type: String },
    password: { type: String, require: true },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);
exports.Account = mongoose.model('Account', AccountSchema);

const DatabaseSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    title: { type: String },
    username: { type: String, required: true },
    password: { type: String },
    address: { type: String, required: true },
    proc: { type: String, require: true },
    isShamsi: { type: Boolean, require: true },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);
exports.Database = mongoose.model('Database', DatabaseSchema);
