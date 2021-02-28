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
const { Barname } = require('../models/Model');
const moment = require('jalali-moment');
const SPSWS = require('../services/SPSWSService');
exports.estelam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { Amount, CallbackURL, Description, Email, Mobile } = req.body;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    SPSWS.estelam({ Amount, CallbackURL, Description, Email, Mobile })
        .then((result) => {
        console.log(result);
        return res.send({ result });
    })
        .catch((err) => res.status(422).send({ error: 'we have an issue', err }));
});
exports.edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { Amount, CallbackURL, Description, Email, Mobile } = req.body;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
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
    Barname.find(query)
        .limit(60)
        // todo sort by date
        .sort({ date: 1 })
        .exec()
        .then((foundedBarname) => res.json({ barname: foundedBarname }))
        .catch((err) => res.status(422).send({ error: 'we have an issue', err }));
});
