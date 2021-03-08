const axios = require('axios');
var xml2js = require('xml2js');
const url = 'https://spsws.bki.ir/spsws.asmx?WSDL';
const userName = '10103740920';
const pass = 'exon@321';

exports.estelam = async (purchaseId: string) => {
  const xmls = `
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
            <tem:kharidId>${401003}</tem:kharidId>
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
        xmls,
        {
          headers: {
            'Content-Type': 'text/xml; charset=utf-8',
            SOAPAction: 'http://tempuri.org/EstelameBarname',
          },
        }
      );
      // console.log(result);

      var parser = new xml2js.Parser(/* options */);
      parser
        .parseStringPromise(result.data)
        .then(function (jsonResult: any) {
          const envelope: any = 'soap:Envelope';
          const body: any = 'soap:Body';
          const diffgram: any = 'diffgr:diffgram';

          const bills = [
            ...jsonResult[envelope][body][0].EstelameBarnameResponse[0]
              .EstelameBarnameResult[0][diffgram][0].NewDataSet[0].Table1,
          ];

          bills.map((bill: any) => {
            console.log(bill);

            return {
              cottageNumber: bill.kutajnumber[0],
              weight: bill.weightk[0],
              draftNumber: bill.hamlid[0],
              billNumber: bill.barnamen[0],
            };
          });

          console.log(bills);
        })
        .catch(function (err: any) {
          console.error(err);
          // Failed
        });
    } catch (error: any) {
      rej(error);
    }
  });
};
