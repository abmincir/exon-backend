import { StatementI } from '../types/KookService.types';
const sql = require('mssql');
const fs = require('fs');
const { Database: DB } = require('../models/Model');

exports.FetchData = async (input: {
  startDate: string;
  endDate: string;
  startDateMiladi: string;
  endDateMiladi: string;
  dbId: string;
}) => {
  const { startDate, endDate, startDateMiladi, endDateMiladi, dbId } = input;

  // connect to your database
  return new Promise(async (res, rej) => {
    const foundedDb = await DB.findById(dbId).exec();

    if (!foundedDb || !foundedDb._id) {
      return rej({ error: `db ${dbId} does not exists` });
    }

    const {
      proc,
      username: user,
      password,
      address: server,
      name: database,
      isShamsi,
    } = foundedDb;

    const config = {
      user,
      password,
      server,
      database,
      options: {
        encrypt: true,
        enableArithAbort: true,
        cryptoCredentialsDetails: {
          minVersion: 'TLSv1',
        },
      },
    };

    sql.connect(config, (error: Error) => {
      if (error) {
        console.log(error);
        rej(error);
      }
      // create Request object
      const request = new sql.Request();
      request.input(
        isShamsi ? 'StartDate' : 'Start',
        sql.VarChar(64),
        isShamsi ? startDate : startDateMiladi
      );
      request.input(
        isShamsi ? 'EndDate' : 'End',
        sql.VarChar(64),
        isShamsi ? endDate : endDateMiladi
      );

      // query to the database and get the records
      return request
        .execute(proc)
        .then((result: any, error: any) => {
          if (error) {
            sql.close();
            console.log(error);
            rej(error);
          }

          console.log(result, result.recordset.length);

          sql.close();

          res(result.recordset);
        })
        .catch((error: any) => {
          console.log(error);

          sql.close();

          rej(error);
        });
    });
  });
};

export const insertPaySamanBankInfo = async (input: StatementI) => {
  return new Promise(async (res, rej) => {
    const {
      agentBranchCode,
      agentBranchName,
      balance,
      branchCode,
      branchName,
      date,
      description,
      referenceNumber,
      registrationNumber,
      serial,
      serialNumber,
      transferAmount,
    } = input;

    const config = {
      user: 'TadbirUser',
      password: '$$$%%%',
      server: '192.168.1.27',
      database: 'AMORVARIDFAR',
      options: {
        encrypt: true,
        enableArithAbort: true,
        cryptoCredentialsDetails: {
          minVersion: 'TLSv1',
        },
      },
    };

    sql.connect(config, (error: Error) => {
      if (error) {
        console.log(error);
        rej(error);
      }

      // create Request object
      const request = new sql.Request();
      request.input('agentBranchCode', sql.NVarChar(255), agentBranchCode);
      request.input('agentBranchName', sql.NVarChar(255), agentBranchName);
      request.input('balance', sql.BigInt, balance);
      request.input('branchCode', sql.NVarChar(255), branchCode);
      request.input('branchName', sql.NVarChar(255), branchName);
      request.input('date', sql.NVarChar(255), date);
      request.input('description', sql.NVarChar(sql.MAX), description);
      request.input('referenceNumber', sql.NVarChar(255), referenceNumber);
      request.input(
        'registrationNumber',
        sql.NVarChar(255),
        registrationNumber
      );
      request.input('serial', sql.BigInt, serial);
      request.input('serialNumber', sql.NVarChar(255), serialNumber);
      request.input('transferAmount', sql.BigInt, transferAmount);

      // query to the database and get the records
      return request
        .query(
          `INSERT INTO [dbo].[UD__PaySamanBankInfo__]
          ([agentBranchCode]
            ,[agentBranchName]
            ,[balance]
            ,[branchCode]
            ,[branchName]
            ,[date]
            ,[description]
            ,[referenceNumber]
            ,[registrationNumber]
            ,[serial]
            ,[serialNumber]
            ,[transferAmount])
            VALUES
            (@agentBranchCode,
            @agentBranchName,
            @balance,
            @branchCode,
            @branchName,
            @date,
            @description,
            @referenceNumber,
            @registrationNumber,
            @serial,
            @serialNumber,
            @transferAmount)`
        )
        .then((result: any, error: any) => {
          if (error) {
            console.log(error);
            sql.close();
            rej(error);
          }

          console.log(result);

          sql.close();

          res(result);
        })
        .catch((error: any) => {
          console.log(error);

          sql.close();

          rej(error);
        });
    });
  });
};
