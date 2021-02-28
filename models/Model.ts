const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BarnameSchema = new Schema(
  {
    ref: { type: String },
    bargah: { type: String },

    havalehCode: { type: String },
    havaleDate: { type: String },

    meli: { type: String },
    custCode: { type: String },
    custName: { type: String },

    price: { type: String },
    vahed: { type: String },

    serial: { type: String },
    code: { type: String },

    carNo: { type: String },

    tel: { type: String },
    postCode: { type: String },
    telAddress: { type: String },

    hamlName: { type: String },
    hamlCode: { type: String },

    receiverName: { type: String },
    dscp: { type: String },

    barNoCode: { type: String },

    barNo: { type: String, unique: true, required: true, dropDups: true },
    barDate: { type: String },
    date: { type: Date },

    weight: { type: String },
    havalehWeight: { type: String },

    status: { type: Number, default: -1 },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

exports.Barname = mongoose.model('Barname', BarnameSchema);

const UserSchema = new Schema(
  {
    username: { type: String, unique: true, required: true },
    password: { type: String },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

exports.User = mongoose.model('User', UserSchema);
