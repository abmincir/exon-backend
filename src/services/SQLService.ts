const sql = require('mssql');
const fs = require('fs');
const { Database: DB } = require('../models/Model');

exports.MockData = async () => {
  return new Promise(async (res, rej) => {
    try {
      let rawData = fs.readFileSync('dummy-data.json');
      let bills = JSON.parse(rawData);

      res(bills);
    } catch (error: any) {
      console.error(error);
      rej(error);
    }
  });
};

exports.FetchData = async (input: {
  startDate: string;
  endDate: string;
  startDateMiladi: string;
  endDateMiladi: string;
  dbId: string;
}) => {
  const { startDate, endDate, startDateMiladi, endDateMiladi, dbId } = input;

  // config for your database
  // const config = {
  //   user: 'sa',
  //   password: 'mis',
  //   server: 'srv-siniran\\SRV_SINIRAN',
  //   database: 'XData',
  //   options: {
  //     encrypt: true,
  //     enableArithAbort: true,
  //     cryptoCredentialsDetails: {
  //       minVersion: 'TLSv1',
  //     },
  //   },
  // };

  // const tadbirConfig = {
  //   user: 'TadbirUser',
  //   password: '$$$%%%',
  //   server: '192.168.1.17',
  //   database: 'TEST1400_6_25',
  //   options: {
  //     encrypt: true,
  //     enableArithAbort: true,
  //     cryptoCredentialsDetails: {
  //       minVersion: 'TLSv1',
  //     },
  //   },
  // };

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
    console.log('--------- config ------------');
    console.log(config);
    console.log('--------- config ------------');

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

// exports.FetchTadbirData = (input: { startDate: string; endDate: string }) => {
//   const { startDate, endDate } = input;

//   // config for your database
//   const config = {
//     user: 'TadbirUser',
//     password: '$$$%%%',
//     server: '192.168.1.27',
//     database: 'TEST1400_6_25',
//     options: {
//       encrypt: true,
//       enableArithAbort: true,
//       cryptoCredentialsDetails: {
//         minVersion: 'TLSv1',
//       },
//     },
//   };

//   // connect to your database
//   return new Promise((res, rej) => {
//     sql.connect(config, (error: Error) => {
//       if (error) {
//         console.log(error);
//         rej(error);
//       }
//       // create Request object
//       const request = new sql.Request();
//       request.input('StartDate', sql.VarChar(64), startDate);
//       request.input('EndDate', sql.VarChar(64), endDate);

//       // query to the database and get the records
//       return request
//         .execute('___BRBarnameProc___')
//         .then((result: any, error: any) => {
//           if (error) {
//             console.log(error);
//             rej(error);
//           }

//           console.log(result, result.recordset.length);

//           res(result.recordset);
//         })
//         .catch((error: any) => {
//           console.log(error);
//           rej(error);
//         });
//     });
//   });
// };

// AMORVARIDFAR

// exports.insertPaySamanBankInfo = (input: {
//   id: number;
//   agentBranchCode: string;
//   agentBranchName: string;
//   balance: number;
//   branchCode: string;
//   branchName: string;
//   date: string;
//   description: string;
//   referenceNumber: string;
//   registrationNumber: string;
//   serial: number;
//   serialNumber: string;
//   transferAmount: number;
// }) => {

//   // config for your database
//   const config = {
//     user: 'TadbirUser',
//     password: '$$$%%%',
//     server: '192.168.1.27',
//     database: 'AMORVARIDFAR',
//     options: {
//       encrypt: true,
//       enableArithAbort: true,
//       cryptoCredentialsDetails: {
//         minVersion: 'TLSv1',
//       },
//     },
//   };

//   // connect to your database
//   return new Promise((res, rej) => {
//     sql.connect(config, (error: Error) => {
//       if (error) {
//         console.log(error);
//         rej(error);
//       }
//       // create Request object
//       const request = new sql.Request();

//       // query to the database and get the records
//       return request
//         .execute('UD__PaySamanBankInfoInsertQuery__')
//         .then((result: any, error: any) => {
//           if (error) {
//             console.log(error);
//             rej(error);
//           }

//           console.log(result);

//           res(result.recordset);
//         })
//         .catch((error: any) => {
//           console.log(error);
//           rej(error);
//         });
//     });
//   });
// };

exports.insertPaySamanBankInfo = async (input: {
  id: number;
  agentBranchCode: string;
  agentBranchName: string;
  balance: number;
  branchCode: string;
  branchName: string;
  date: string;
  description: string;
  referenceNumber: string;
  registrationNumber: string;
  serial: number;
  serialNumber: string;
  transferAmount: number;
}) => {
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
