const axios = require('axios');
var xml2js = require('xml2js');
const url = 'https://spsws.bki.ir/spsws.asmx?WSDL';
const userName = '10103740920';
const pass = 'exon@321';

exports.estelam = async (purchaseId: string) => {
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

  return new Promise(async (res, rej) => {
    try {
      const result = await axios.post(
        'https://spsws.bki.ir/spsws.asmx?op=EstelameBarname',
        xml,
        {
          headers: {
            'Content-Type': 'text/xml; charset=utf-8',
            SOAPAction: 'http://tempuri.org/EstelameBarname',
          },
        }
      );

      var parser = new xml2js.Parser(/* options */);
      parser
        .parseStringPromise(result.data)
        .then(function (jsonResult: any) {
          const envelope: any = 'soap:Envelope';
          const body: any = 'soap:Body';
          const diffgram: any = 'diffgr:diffgram';

          const result = [
            ...jsonResult[envelope][body][0].EstelameBarnameResponse[0]
              .EstelameBarnameResult[0][diffgram][0].NewDataSet[0].Table1,
          ];

          const bills: any = [];
          const errors: any = [];

          result.map((bill: any, index: number) => {
            if (index < result.length - 1) {
              bills.push({
                cottageNumber:
                  bill && bill.kutajnumber ? bill.kutajnumber[0] : '',
                weight: bill && bill.weightk ? bill.weightk[0] : '',
                draftNumber: bill && bill.hamlid ? bill.hamlid[0] : '',
                billNumber: bill && bill.barnamen ? bill.barnamen[0] : '',
                driverName: bill && bill.drivern ? bill.drivern[0] : '',
              });
            } else {
              errors.push({
                errorCode: bill && bill.ErrorCode ? bill.ErrorCode[0] : '',
                errorMessage: bill && bill.ErrorMsg ? bill.ErrorMsg[0] : '',
              });
            }
          });

          if (errors[0].errorCode !== '0') {
            rej(errors);
          } else {
            res(bills);
          }
        })
        .catch(function (err: any) {
          console.error(err);
          rej(err);
        });
    } catch (error: any) {
      rej(error);
    }
  });
};

exports.edit = async (bill: any, weight: string) => {
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

  return new Promise(async (res, rej) => {
    try {
      const result = await axios.post(
        'https://spsws.bki.ir/spsws.asmx?op=EditBarname',
        xml,
        {
          headers: {
            'Content-Type': 'text/xml; charset=utf-8',
            SOAPAction: 'http://tempuri.org/EditBarname',
          },
        }
      );

      var parser = new xml2js.Parser(/* options */);
      parser
        .parseStringPromise(result.data)
        .then(function (jsonResult: any) {
          const envelope: any = 'soap:Envelope';
          const body: any = 'soap:Body';
          const diffgram: any = 'diffgr:diffgram';

          const result =
            jsonResult[envelope][body][0].EditBarnameResponse[0]
              .EditBarnameResult[0][diffgram][0].NewDataSet[0].Table1;

          const errors: any = [];

          result.map(async (bill: any, index: number) => {
            if (index < result.length - 1) {
              if (bill && bill.errorcode && bill.errorcode[0] === '0') {
                errors.push({
                  errorCode: bill && bill.errorcode ? bill.errorcode[0] : '',
                  errorMessage: bill && bill.errormsg ? bill.errormsg[0] : '',
                });
              } else {
                let changedBill: any;
                try {
                  changedBill = await Bill.findById(bill._id);
                } catch (err: any) {
                  rej('Not Found After Edit');
                }
                changedBill.merchantWeight = weight;
                changedBill.save().then();
              }
            } else {
              errors.push({
                errorCode: bill && bill.ErrorCode ? bill.ErrorCode[0] : '',
                errorMessage: bill && bill.ErrorMsg ? bill.ErrorMsg[0] : '',
              });
            }
          });

          const error = result.find((error: any) => error.errorCode === '0');

          if (error) {
            rej(errors);
          } else {
            res('success');
          }
        })
        .catch(function (err: any) {
          console.error(err);
          rej(err);
        });
    } catch (error: any) {
      rej(error);
    }
  });
};
