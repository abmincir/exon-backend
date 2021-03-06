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
const sql = require('mssql');
const nodeFetch = require('node-fetch');
exports.MockData = () => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((res, rej) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = yield nodeFetch('https://github.com/AmirHosein-Farhadi/exon-backend/blob/main/dummy-data.json', {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            });
            res(data);
        }
        catch (error) {
            console.error(error);
            rej(error);
        }
    }));
});
exports.FetchData = (input) => {
    const { startDate, endDate } = input;
    // config for your database
    const config = {
        user: 'sa',
        password: 'mis',
        server: 'srv-siniran\\SRV_SINIRAN',
        database: 'XData',
        options: {
            encrypt: true,
            enableArithAbort: true,
            cryptoCredentialsDetails: {
                minVersion: 'TLSv1',
            },
        },
    };
    // connect to your database
    return new Promise((res, rej) => {
        sql.connect(config, (error) => {
            if (error) {
                console.log(error);
                rej(error);
            }
            // create Request object
            const request = new sql.Request();
            request.input('StartDate', sql.VarChar(64), startDate);
            request.input('EndDate', sql.VarChar(64), endDate);
            // query to the database and get the records
            return request
                .execute('__BarnameProc__')
                .then((result, error) => {
                if (error) {
                    console.log(error);
                    rej(error);
                }
                res(result.recordset);
            })
                .catch((error) => {
                console.log(error);
                rej(error);
            });
        });
    });
};
