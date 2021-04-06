"use strict";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BillSchema = new Schema({
    allocationId: String,
    purchaseId: String,
    saveDate: String,
    merchantWeight: String,
    spsWeight: String,
    spsDraft: String,
    cottageNumber: String,
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
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });
exports.Bill = mongoose.model('Bill', BillSchema);
const UserSchema = new Schema({
    username: { type: String, unique: true, required: true },
    name: { type: String },
    password: { type: String },
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });
exports.User = mongoose.model('User', UserSchema);
