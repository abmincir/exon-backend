"use strict";
const soap = require('soap');
const url = 'https://spsws.bki.ir/spsws.asmx?WSDL';
const userName = '10103740920';
const pass = 'exon@321';
exports.estelam = () => {
    const args = {
        userName,
        pass,
    };
    soap.createClient(url, (error, client) => {
        if (error) {
            console.error('Error Creating The Soap Client -> ', error);
            return;
        }
        client.EstelameBarname(args, (estelamError, result) => {
            if (estelamError) {
                console.error('Error Sending Estelam Request -> ', estelamError);
            }
            const parseData = JSON.parse(JSON.stringify(result));
            console.log(parseData);
        });
    });
};
// const request = (zpamount, zpemail, zpphone, zpdesc, redirect, zpcallback) => {
//   const url = appConfig.zarinpalSoapServer;
//   const args = {
//     MerchantID: appConfig.zarinpalMerchant,
//     Amount: zpamount,
//     Description: zpdesc,
//     Email: zpemail,
//     Mobile: zpphone,
//     CallbackURL: redirect,
//   };
//   soap.createClient(url, (err, client) => {
//     client.PaymentRequest(args, (err, result) => {
//       const parseData = JSON.parse(JSON.stringify(result));
//       if (Number(parseData.Status) === 100) {
//         const status = true;
//         const url =
//           'https://www.zarinpal.com/pg/StartPay/' + parseData.Authority;
//         zpcallback({ status: status, url: url });
//       } else {
//         const status = false;
//         const code = parseData.Status;
//         zpcallback({ status: status, code: 'خطایی پیش آمد! ' + code });
//       }
//     });
//   });
// };
