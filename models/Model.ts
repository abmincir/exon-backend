const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BarnameSchema = new Schema(
  {
    takhsisId: { type: String },
    kharidId: { type: String },

    // code mahmule
    havalehNumber: { type: String },
    havalehWeight: { type: String },
    havalehCode: { type: String },
    havaleDate: { type: String },

    receiverMeliCode: { type: String },
    receiverPostCode: { type: String },
    receiverTelAddress: { type: String },

    customerCode: { type: String },
    customerName: { type: String },

    sellerCode: { type: String },

    carNumber: { type: String },

    telephone: { type: String },

    //Destination
    startName: { type: String },
    startCode: { type: String },

    receiverName: { type: String },
    receiverAddress: { type: String },

    //kala
    kalaName: { type: String },
    vahedShomaresh: { type: String },
    fiForush: { type: String },

    // todo detect unique field
    barNo: { type: String, unique: true, required: true, dropDups: true },

    barnameRadif: { type: String },
    barnameNumber: { type: String },
    barnameSerial: { type: String },
    barnameWeight: { type: String },
    barnameDate: { type: String },

    date: { type: Date },
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
