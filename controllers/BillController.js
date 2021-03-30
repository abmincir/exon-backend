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
    const { _id, purchaseId, billNumber, weight } = req.body;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    try {
        const result = yield SPSWS.estelam(purchaseId);
        const foundedBill = result.find((bill) => bill.billNumber === billNumber);
        if (!foundedBill) {
            Bill.findById(_id, (err, doc) => {
                if (err) {
                    res.status(422).send({ error: 'we have an issue', err });
                }
                doc.status = 2;
                doc.save().then(() => {
                    res.status(422).send({
                        error: 'we have an issue',
                        err: 'بارنامه مورد نظر موجود نیست',
                    });
                });
            });
        }
        if (weight !== foundedBill.weight) {
            Bill.findById(_id, (err, doc) => {
                if (err) {
                    res.status(422).send({ error: 'we have an issue', err });
                }
                doc.cottageNumber = foundedBill.cottageNumber;
                doc.spsWeight = foundedBill.weight;
                doc.status = 0;
                doc.save().then(() => {
                    res.status(422).send({
                        error: 'we have an issue',
                        err: 'عدم تطابق وزن',
                    });
                });
            });
        }
        Bill.findById(_id, (err, doc) => {
            if (err) {
                res.status(422).send({ error: 'we have an issue', err });
            }
            doc.cottageNumber = foundedBill.cottageNumber;
            doc.spsWeight = foundedBill.weight;
            doc.spsDraft = foundedBill.draftNumber;
            doc.driver.name = foundedBill.driverName;
            doc.status = 1;
            doc.save().then(() => res.send({ result }));
        });
    }
    catch (err) {
        console.error(err);
        res.status(422).send({ error: 'we have an issue', err });
    }
});
exports.edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id, weight } = req.body;
    let bill;
    try {
        bill = yield Bill.findById(_id);
    }
    catch (err) {
        res.status(422).send({ error: 'we have an issue', err });
    }
    SPSWS.edit(_id, bill, weight)
        .then((result) => {
        return res.send({ result });
    })
        .catch((err) => res.status(422).send({ error: 'we have an issue', err }));
});
exports.getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { startDateBill, endDateBill, startDateSave, endDateSave, billNumber, purchaseNumber, status, } = req.body;
    status = status || status === '0' ? +status : -2;
    console.log('\n-----\nSearching -> ', {
        startDateBill,
        endDateBill,
        startDateSave,
        endDateSave,
        billNumber,
        purchaseNumber,
        status,
    });
    let query = {};
    if (status !== -2) {
        Object.assign(query, { status });
    }
    console.log(query);
    if (billNumber) {
        Object.assign(query, { 'bill.number': billNumber });
    }
    if (purchaseNumber) {
        Object.assign(query, { purchaseId: purchaseNumber });
    }
    if (startDateBill && endDateBill) {
        const startDateG = moment
            .from(startDateBill, 'fa', 'YYYY/MM/DD')
            .locale('en')
            .format('YYYY-M-D HH:mm:ss');
        const endDateG = moment
            .from(endDateBill, 'fa', 'YYYY/MM/DD')
            .locale('en')
            .format('YYYY-M-D HH:mm:ss');
        Object.assign(query, {
            date: {
                $gte: new Date(startDateG),
                $lte: new Date(endDateG),
            },
        });
    }
    else if (startDateBill) {
        const startDateG = moment
            .from(startDateBill, 'fa', 'YYYY/MM/DD')
            .locale('en')
            .format('YYYY-M-D HH:mm:ss');
        Object.assign(query, {
            date: {
                $gte: new Date(startDateG),
            },
        });
    }
    if (startDateSave && endDateSave) {
        const startDateG = moment
            .from(startDateSave, 'fa', 'YYYY/MM/DD')
            .locale('en')
            .format('YYYY-M-D HH:mm:ss');
        const endDateG = moment
            .from(endDateSave, 'fa', 'YYYY/MM/DD')
            .locale('en')
            .format('YYYY-M-D HH:mm:ss');
        Object.assign(query, {
            // todo change
            date: {
                $gte: new Date(startDateG),
                $lte: new Date(endDateG),
            },
        });
    }
    else if (startDateSave) {
        const startDateG = moment
            .from(startDateSave, 'fa', 'YYYY/MM/DD')
            .locale('en')
            .format('YYYY-M-D HH:mm:ss');
        Object.assign(query, {
            // todo change
            date: {
                $gte: new Date(startDateG),
            },
        });
    }
    Bill.find(query)
        // .limit(60)
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
        // const result = await SQLService.MockData({
        const result = yield SQLService.FetchData({
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
            return new Bill({
                allocationId: bill.ref,
                purchaseId: bill.bargah,
                salesmanCode: bill.code,
                driver: {
                    carNumber: bill.Carno,
                },
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
                    telephone: bill.tel,
                    telAddress: bill.telAdress,
                    nationalId: bill.meli,
                },
                product: {
                    name: bill.Dscp,
                    unit: bill.Vahed,
                    pricePerSale: bill.price,
                },
                bill: {
                    id: bill.Barno + '@' + bill.barnoCode,
                    row: bill.serial,
                    number: bill.Barno.split('-')[0],
                    serial: bill.Barno.split('-')[1],
                    weight: bill.weight,
                    date: bill.barDate,
                },
                date: mongoDate,
            });
        });
        Promise.all(Bill.insertMany(bills))
            .then((dep) => {
            // this will be called when all inserts finish
            console.log('%%%%%%%%%%%%%%%%%%%', bills.length, dep.length);
            let query = {
                date: {
                    $gte: new Date(startDateMongo),
                    $lte: new Date(endDateMongo),
                },
            };
            Bill.find(query)
                // .limit(60)
                .sort({ date: 1 })
                .exec()
                .then((foundedBill) => res.json({ bill: foundedBill }))
                .catch((err) => res.status(422).send({ error: 'we have an issue', err }));
            // res.sendStatus(201);
        })
            .catch((err) => {
            console.log(err);
        });
        Bill.insertMany(bills)
            .then((savedBills) => {
            console.log(bills.length, savedBills.length);
        })
            .catch((error) => {
            if (error) {
                console.error(error);
            }
        })
            .finally(() => {
            let query = {
                date: {
                    $gte: new Date(startDateMongo),
                    $lte: new Date(endDateMongo),
                },
            };
            Bill.find(query)
                // .limit(60)
                .sort({ date: 1 })
                .exec()
                .then((foundedBill) => res.json({ bill: foundedBill }))
                .catch((err) => res.status(422).send({ error: 'we have an issue', err }));
        });
    }
    catch (error) {
        console.error(error);
    }
});
