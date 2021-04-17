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
const axios = require('axios');
var xml2js = require('xml2js');
const BillModel = require('../models/Model').Bill;
const url = 'https://spsws.bki.ir/spsws.asmx?WSDL';
const userName = '10103740920';
const pass = 'exon@321';
exports.estelam = (purchaseId) => __awaiter(void 0, void 0, void 0, function* () {
    const xml = `
  <x:Envelope
    xmlns:x="http://schemas.xmlsoap.org/soap/envelope/"
    xmlns:tem="http://tempuri.org/">
    <x:Header/>
    <x:Body>
        <tem:EstelameBarname>
            <tem:userName>10103740920</tem:userName>
            <tem:pass>exon@321</tem:pass>
            <tem:fromDate></tem:fromDate>
            <tem:toDate></tem:toDate>
            <tem:kharidId>${purchaseId}</tem:kharidId>
            <tem:TakhsisId></tem:TakhsisId>
            <tem:KutajNumber></tem:KutajNumber>
            <tem:IdHaml></tem:IdHaml>
        </tem:EstelameBarname>
    </x:Body>
  </x:Envelope>
  `;
    return new Promise((res, rej) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const result = yield axios.post('https://spsws.bki.ir/spsws.asmx?op=EstelameBarname', xml, {
                headers: {
                    'Content-Type': 'text/xml; charset=utf-8',
                    SOAPAction: 'http://tempuri.org/EstelameBarname',
                },
            });
            var parser = new xml2js.Parser( /* options */);
            parser
                .parseStringPromise(result.data)
                .then(function (jsonResult) {
                const envelope = 'soap:Envelope';
                const body = 'soap:Body';
                const diffgram = 'diffgr:diffgram';
                const result = [
                    ...jsonResult[envelope][body][0].EstelameBarnameResponse[0]
                        .EstelameBarnameResult[0][diffgram][0].NewDataSet[0].Table1,
                ];
                console.log(result);
                const bills = [];
                const errors = [];
                result.map((bill, index) => {
                    if (index < result.length - 1) {
                        bills.push({
                            cottageNumber: bill && bill.kutajnumber ? bill.kutajnumber[0] : '',
                            weight: bill && bill.weightk ? bill.weightk[0] : '',
                            draftNumber: bill && bill.hamlid ? bill.hamlid[0] : '',
                            billNumber: bill && bill.barnamen ? bill.barnamen[0] : '',
                            driverName: bill && bill.drivern ? bill.drivern[0] : '',
                        });
                    }
                    else {
                        errors.push({
                            errorCode: bill && bill.ErrorCode ? bill.ErrorCode[0] : '',
                            errorMessage: bill && bill.ErrorMsg ? bill.ErrorMsg[0] : '',
                        });
                    }
                });
                if (errors[0].errorCode !== '0') {
                    rej(errors);
                }
                else {
                    res(bills);
                }
            })
                .catch(function (err) {
                console.error(err);
                rej(err);
            });
        }
        catch (error) {
            rej(error);
        }
    }));
});
exports.estelamByDate = (startDate, endDate) => __awaiter(void 0, void 0, void 0, function* () {
    const xml = `
  <x:Envelope
    xmlns:x="http://schemas.xmlsoap.org/soap/envelope/"
    xmlns:tem="http://tempuri.org/">
    <x:Header/>
    <x:Body>
        <tem:EstelameBarname>
            <tem:userName>10103740920</tem:userName>
            <tem:pass>exon@321</tem:pass>
            <tem:fromDate></tem:fromDate>
            <tem:toDate></tem:toDate>
            <tem:kharidId></tem:kharidId>
            <tem:TakhsisId></tem:TakhsisId>
            <tem:KutajNumber></tem:KutajNumber>
            <tem:IdHaml></tem:IdHaml>
        </tem:EstelameBarname>
    </x:Body>
  </x:Envelope>
  `;
    return new Promise((res, rej) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const result = yield axios.post('https://spsws.bki.ir/spsws.asmx?op=EstelameBarname', xml, {
                headers: {
                    'Content-Type': 'text/xml; charset=utf-8',
                    SOAPAction: 'http://tempuri.org/EstelameBarname',
                },
            });
            var parser = new xml2js.Parser( /* options */);
            parser
                .parseStringPromise(result.data)
                .then(function (jsonResult) {
                const envelope = 'soap:Envelope';
                const body = 'soap:Body';
                const diffgram = 'diffgr:diffgram';
                const result = [
                    ...jsonResult[envelope][body][0].EstelameBarnameResponse[0]
                        .EstelameBarnameResult[0][diffgram][0].NewDataSet[0].Table1,
                ];
                const bills = [];
                const errors = [];
                result.map((bill, index) => {
                    if (index < result.length - 1) {
                        bills.push({
                            cottageNumber: bill && bill.kutajnumber ? bill.kutajnumber[0] : '',
                            weight: bill && bill.weightk ? bill.weightk[0] : '',
                            draftNumber: bill && bill.hamlid ? bill.hamlid[0] : '',
                            billNumber: bill && bill.barnamen ? bill.barnamen[0] : '',
                            driverName: bill && bill.drivern ? bill.drivern[0] : '',
                        });
                    }
                    else {
                        errors.push({
                            errorCode: bill && bill.ErrorCode ? bill.ErrorCode[0] : '',
                            errorMessage: bill && bill.ErrorMsg ? bill.ErrorMsg[0] : '',
                        });
                    }
                });
                if (errors[0].errorCode !== '0') {
                    rej(errors);
                }
                else {
                    res(bills);
                }
            })
                .catch(function (err) {
                console.error(err);
                rej(err);
            });
        }
        catch (error) {
            rej(error);
        }
    }));
});
exports.edit = (_id, bill, weight) => __awaiter(void 0, void 0, void 0, function* () {
    const { spsDraft } = bill;
    const { name, carNumber } = bill.driver;
    const billNumber = bill.bill.number;
    const receiverName = bill.receiver.name;
    const receiverAddress = bill.receiver.telAddress;
    const receiverPhone = bill.receiver.telephone;
    const xml = `
  <x:Envelope
  xmlns:x="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:tem="http://tempuri.org/">
    <x:Header/>
    <x:Body>
      <tem:EditBarname>
          <tem:userName>10103740920</tem:userName>
          <tem:pass>exon@321</tem:pass>
          <tem:HamlId>${spsDraft}</tem:HamlId>
          <tem:value>${weight}</tem:value>
          <tem:DriverName>${name}</tem:DriverName>
          <tem:CarNo>${carNumber}</tem:CarNo>
          <tem:barnameh>${billNumber}</tem:barnameh>
          <tem:serialNo></tem:serialNo>
          <tem:RecieverName>${receiverName}</tem:RecieverName>
          <tem:IssuDate></tem:IssuDate>
          <tem:reciverAddress>${receiverAddress}</tem:reciverAddress>
          <tem:recieverPhone>${receiverPhone}</tem:recieverPhone>
      </tem:EditBarname>
    </x:Body>
  </x:Envelope>
  `;
    return new Promise((res, rej) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const result = yield axios.post('https://spsws.bki.ir/spsws.asmx?op=EditBarname', xml, {
                headers: {
                    'Content-Type': 'text/xml; charset=utf-8',
                    SOAPAction: 'http://tempuri.org/EditBarname',
                },
            });
            var parser = new xml2js.Parser( /* options */);
            parser
                .parseStringPromise(result.data)
                .then(function (jsonResult) {
                const envelope = 'soap:Envelope';
                const body = 'soap:Body';
                const diffgram = 'diffgr:diffgram';
                const result = jsonResult[envelope][body][0].EditBarnameResponse[0]
                    .EditBarnameResult[0][diffgram][0].NewDataSet[0].Table1;
                console.log('------------- EDIT BARNAME CALLED -------------');
                console.log(result);
                console.log('------------- EDIT BARNAME CALLED -------------');
                const errors = [];
                result.map((bill, index) => __awaiter(this, void 0, void 0, function* () {
                    if (index < result.length - 1) {
                        if (bill && bill.errorcode && bill.errorcode[0] !== '0') {
                            errors.push({
                                errorCode: bill && bill.errorcode ? bill.errorcode[0] : '',
                                errorMessage: bill && bill.errormsg ? bill.errormsg[0] : '',
                            });
                        }
                        else {
                            try {
                                console.log('Editing ', _id);
                                const changedBill = yield BillModel.findById(_id);
                                changedBill.merchantWeight = weight;
                                changedBill
                                    .save()
                                    .then(() => console.log('Edited And Saved'));
                            }
                            catch (err) {
                                console.error(err);
                                rej({ error: 'Not Found After Edit', err });
                            }
                        }
                    }
                    else {
                        errors.push({
                            errorCode: bill && bill.ErrorCode ? bill.ErrorCode[0] : '',
                            errorMessage: bill && bill.ErrorMsg ? bill.ErrorMsg[0] : '',
                        });
                    }
                }));
                const error = result.find((error) => error.errorCode === '0');
                if (error) {
                    rej(errors);
                }
                else {
                    res('success');
                }
            })
                .catch(function (err) {
                console.error(err);
                rej(err);
            });
        }
        catch (error) {
            rej(error);
        }
    }));
});
exports.insert = (_id, bill) => __awaiter(void 0, void 0, void 0, function* () {
    const calcCreatedDate = (bill.saveDate[0] === '9' ||
        bill.saveDate[0] === '8' ||
        bill.saveDate[0] === '7'
        ? '13'
        : '14') + bill.saveDate;
    console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%');
    console.log({
        billNumber: bill.bill.number,
        billSerial: bill.bill.serial,
        saveDate: bill.saveDate,
        issueDateValid: calcCreatedDate,
        weight: bill.bill.weight,
        purchaseId: bill.purchaseId,
        assignmentId: bill.assignmentId,
    });
    console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%');
    const xml = `
<x:Envelope
    xmlns:x="http://schemas.xmlsoap.org/soap/envelope/"
    xmlns:tem="http://tempuri.org/">
    <x:Header/>
    <x:Body>
        <tem:insertBarname>
            <tem:userName>10103740920</tem:userName>
            <tem:pass>exon@321</tem:pass>
            <tem:BarNumber>${bill.bill.number}</tem:BarNumber>
            <tem:BarSerial>${bill.bill.serial}</tem:BarSerial>
            <tem:ISSUDATE>${calcCreatedDate}</tem:ISSUDATE>
            <tem:MerchantDeclaredWeight>${bill.bill.weight}</tem:MerchantDeclaredWeight>
            <tem:KharidId>${bill.purchaseId}</tem:KharidId>
            <tem:takhsisId>${bill.assignmentId}</tem:takhsisId>
        </tem:insertBarname>
    </x:Body>
</x:Envelope>
  `;
    return new Promise((res, rej) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('\n\nTAKHSIS -> ' + bill.assignmentId);
        if (!!!bill.assignmentId) {
            return rej({
                error: 'عدم وجود شماره تخصیص',
                err: 'عدم وجود شماره تخصیص',
            });
        }
        try {
            const result = yield axios.post('https://spsws.bki.ir/spsws.asmx?op=insertBarname', xml, {
                headers: {
                    'Content-Type': 'text/xml; charset=utf-8',
                    SOAPAction: 'http://tempuri.org/insertBarname',
                },
            });
            var parser = new xml2js.Parser( /* options */);
            parser
                .parseStringPromise(result.data)
                .then(function (jsonResult) {
                const envelope = 'soap:Envelope';
                const body = 'soap:Body';
                const diffgram = 'diffgr:diffgram';
                const result = jsonResult[envelope][body][0].insertBarnameResponse[0]
                    .insertBarnameResult[0][diffgram][0].NewDataSet[0].Table1;
                console.log('+++++++++++++ Insert Bill CALLED +++++++++++++');
                console.log(result);
                console.log('+++++++++++++ Insert Bill CALLED +++++++++++++');
                if (result.length < 1) {
                    return rej({
                        error: 'خطا در دریافت اطلاعات',
                        err: 'خطا در دریافت اطلاعات',
                    });
                }
                if (result[0] &&
                    result[0].ErrorCode &&
                    result[0].ErrorCode[0] !== '0') {
                    return rej({
                        error: result[0] && result[0].ErrorMsg
                            ? result[0].ErrorMsg[0]
                            : 'خطا در دریافت اطلاعات',
                        err: result[0] && result[0].ErrorMsg
                            ? result[0].ErrorMsg[0]
                            : 'خطا در دریافت اطلاعات',
                    });
                }
                // todo save some data to bill
                return res('success');
            })
                .catch(function (err) {
                console.error(err);
                return rej(err);
            });
        }
        catch (error) {
            return rej(error);
        }
    }));
});
