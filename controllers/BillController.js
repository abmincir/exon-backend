"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { Bill } = require('../models/Model');
const moment = require('jalali-moment');
const SPSWS = require('../services/SPSWSService');
const SQLService = require('../services/SQLService');
exports.estelam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const { userName, pass, kharidId, toDate, fromDate } = req.body;
    try {
        const result = yield SPSWS.estelam({
        // userName,
        // pass,
        // kharidId,
        // toDate,
        // fromDate,
        });
        res.send({ result });
    }
    catch (error) {
        console.error(error);
    }
});
exports.edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { Amount, CallbackURL, Description, Email, Mobile } = req.body;
    SPSWS.estelam({ Amount, CallbackURL, Description, Email, Mobile })
        .then((result) => {
        console.log(result);
        return res.send({ result });
    })
        .catch((err) => res.status(422).send({ error: 'we have an issue', err }));
});
exports.getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { startDate, endDate } = req.body;
    if (!startDate || !endDate) {
        startDate = moment().locale('fa').format('YYYY/MM/DD');
        endDate = moment().locale('fa').add(1, 'day').format('YYYY/MM/DD');
    }
    const startDateG = moment
        .from(startDate, 'fa', 'YYYY/MM/DD')
        .locale('en')
        .format('YYYY-M-D HH:mm:ss');
    const endDateG = moment
        .from(endDate, 'fa', 'YYYY/MM/DD')
        .locale('en')
        .format('YYYY-M-D HH:mm:ss');
    console.log('Start Date Is -> ', startDate, startDateG, new Date(startDateG));
    console.log('-----------------');
    console.log('End Date Is -> ', endDate, endDateG, new Date(endDateG));
    let query = {
        date: {
            $gte: new Date(startDateG),
            $lt: new Date(endDateG),
        },
    };
    Bill.find(query)
        .limit(60)
        .sort({ date: 1 })
        .exec()
        .then((foundedBill) => res.json({ bill: foundedBill }))
        .catch((err) => res.status(422).send({ error: 'we have an issue', err }));
});
exports.fetch = (req, res) => {
    const { startDate, endDate } = req.body;
    SQLService.FetchData({ startDate, endDate }).then((result) => {
        console.log(result);
        res.send(result);
    }, (error) => console.error(error));
};
exports.dummy = (req, res) => {
    SQLService.MockData().then((result) => {
        console.log(result);
        res.send(result);
    }, (error) => console.error(error));
};
exports.updateDb = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { startDate, endDate } = req.body;
    if (!startDate || !endDate) {
        startDate = moment().locale('fa').format('YYYY/MM/DD');
        endDate = moment().locale('fa').add(1, 'day').format('YYYY/MM/DD');
    }
    const startDateSql = startDate.substring(2);
    const endDateSql = endDate.substring(2);
    const startDateMongo = moment
        .from(startDate, 'fa', 'YYYY/MM/DD')
        .locale('en')
        .format('YYYY-M-D HH:mm:ss');
    const endDateMongo = moment
        .from(endDate, 'fa', 'YYYY/MM/DD')
        .locale('en')
        .format('YYYY-M-D HH:mm:ss');
    console.log('+++++++++++++++++');
    console.log('Start Date Is -> ', {
        startDate,
        startDateSql,
        startDateMongo,
        dateObj: new Date(startDateMongo),
    });
    console.log('-----------------');
    console.log('End Date Is -> ', {
        endDate,
        endDateSql,
        endDateMongo,
        dateObj: new Date(endDateMongo),
    });
    console.log('+++++++++++++++++');
    try {
        // const result = await SQLService.FetchData({
        const result = yield SQLService.MockData({
            startDate: startDateSql,
            endDate: endDateSql,
        });
        const bills = [...result].map((bill) => {
            const calculatedDate = (bill.barDate[0] === '9' ||
                bill.barDate[0] === '8' ||
                bill.barDate[0] === '7'
                ? '13'
                : '14') + bill.barDate;
            const mongoDate = new Date(moment
                .from(calculatedDate, 'fa', 'YYYY/MM/DD')
                .locale('en')
                .format('YYYY-M-D HH:mm:ss'));
            const newBill = new Bill({
                allocationId: bill.ref,
                purchaseId: bill.bargah,
                salesmanCode: bill.code,
                carNumber: bill.Carno,
                telephone: bill.tel,
                draft: {
                    number: bill.barnoCode,
                    weight: bill.havaleWeight,
                    code: bill.havalehcode,
                    date: bill.havaleDate,
                },
                customer: {
                    name: bill.custname,
                    code: bill.custcode,
                },
                origin: {
                    name: bill.hamlname,
                    code: bill.hamlcode,
                },
                receiver: {
                    name: bill.recivename,
                    postCode: bill.post_code,
                    telAddress: bill.telAdress,
                    nationalId: bill.meli,
                },
                product: {
                    name: bill.Dscp,
                    unit: bill.Vahed,
                    pricePerSale: bill.price,
                },
                bill: {
                    id: bill.Barno,
                    row: bill.serial,
                    number: bill.Barno.split('-')[0],
                    serial: bill.Barno.split('-')[1],
                    weight: bill.weight,
                    date: bill.barDate,
                },
                date: mongoDate,
            });
            newBill
                .save()
                .then()
                .catch((err) => {
                console.log(err);
            });
            return newBill;
        });
        Bill.insertMany(bills, (error) => {
            if (error) {
                console.log(error);
            }
        });
    }
    catch (error) {
        console.error(error);
    }
    let query = {
        date: {
            $gte: new Date(startDateMongo),
            $lt: new Date(endDateMongo),
        },
    };
    Bill.find(query)
        .limit(60)
        .sort({ date: 1 })
        .exec()
        .then((foundedBill) => res.json({ bill: foundedBill }))
        .catch((err) => res.status(422).send({ error: 'we have an issue', err }));
});
