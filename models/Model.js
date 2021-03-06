"use strict";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BillSchema = new Schema({
    allocationId: String,
    purchaseId: String,
    merchantWeight: String,
    spsWeight: String,
    cottageNumber: String,
    salesmanCode: String,
    carNumber: String,
    telephone: String,
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
        telAddress: String,
        nationalId: String,
    },
    product: {
        name: String,
        unit: String,
        pricePerSale: String,
    },
    bill: {
        row: String,
        number: String,
        serial: String,
        weight: String,
        date: String,
    },
    date: Date,
    status: { type: Number, default: -1 },
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });
exports.Bill = mongoose.model('Bill', BillSchema);
const UserSchema = new Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String },
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });
exports.User = mongoose.model('User', UserSchema);
