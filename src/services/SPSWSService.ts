import axios from 'axios';
import xml2js from 'xml2js';
import {
  editXML,
  estelamByDateXML,
  estelamXML,
  extractBillsAndErrors,
  insertXML,
} from '../helpers/xml.helper';
import { Bill } from '../models/bill.model';

const BASE_URL = 'https://spsws.bki.ir/spsws.asmx?WSDL';
const DEFAULT_USERNAME = '10103012748';
const DEFAULT_PASSWORD = '$@10103012748';

async function parseXMLToJSON(data: string): Promise<any> {
  const parser = new xml2js.Parser();
  return parser.parseStringPromise(data);
}

async function postXML(endpoint: string, xml: string): Promise<any> {
  return axios.post(`${BASE_URL}?op=${endpoint}`, xml, {
    headers: {
      'Content-Type': 'text/xml; charset=utf-8',
      SOAPAction: `http://tempuri.org/${endpoint}`,
    },
  });
}

export const estelam = async (
  purchaseId: string,
  username: string = DEFAULT_USERNAME,
  password: string = DEFAULT_PASSWORD,
): Promise<any> => {
  const xml = estelamXML(username, password, purchaseId);

  try {
    const response = await postXML('EstelameBarname', xml);
    const jsonResponse = await parseXMLToJSON(response.data);

    const { bills, errors } = extractBillsAndErrors(jsonResponse);

    if (errors[0].errorCode !== '0') {
      throw errors;
    } else {
      return bills;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const estelamByDate = async (startDate: string, endDate: string): Promise<any> => {
  const xml = estelamByDateXML;

  try {
    const response = await postXML('EstelameBarname', xml);
    const jsonResponse = await parseXMLToJSON(response.data);

    const { bills, errors } = extractBillsAndErrors(jsonResponse);

    if (errors[0].errorCode !== '0') {
      throw errors;
    } else {
      return bills;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const edit = async (
  _id: string,
  bill: any,
  weight: string,
  username: string = DEFAULT_USERNAME,
  password: string = DEFAULT_PASSWORD,
): Promise<string | any[]> => {
  const { spsDraft, driver, receiver } = bill;
  const { name, carNumber } = driver;
  const {
    name: receiverName,
    telAddress: receiverAddress,
    telephone: receiverPhone,
  } = receiver;
  const billNumber = bill.bill.number;

  const xml = editXML(
    username,
    password,
    spsDraft,
    weight,
    name,
    carNumber,
    billNumber,
    receiverName,
    receiverAddress,
    receiverPhone,
  );

  try {
    const response = await postXML('EditBarname', xml);
    const jsonResponse = await parseXMLToJSON(response.data);

    const result =
      jsonResponse['soap:Envelope']['soap:Body'][0].EditBarnameResponse[0]
        .EditBarnameResult[0]['diffgr:diffgram'][0].NewDataSet[0].Table1;

    const errors = result
      .slice(0, -1)
      .filter((bill: any) => bill.errorcode && bill.errorcode[0] !== '0')
      .map((bill: any) => ({
        errorCode: bill.errorcode[0],
        errorMessage: bill.errormsg[0],
      }));

    if (!errors.length) {
      try {
        const changedBill = await Bill.findById(_id);

        if (!changedBill) {
          throw new Error('Bill Not Found');
        }

        changedBill.merchantWeight = weight;
        await changedBill.save();

        return 'success';
      } catch (err) {
        console.error(err);
        throw { error: 'Not Found After Edit', err };
      }
    } else {
      throw errors;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const insert = async (
  _id: string,
  bill: any,
  username: string = DEFAULT_USERNAME,
  password: string = DEFAULT_PASSWORD,
): Promise<boolean | any> => {
  const calcCreatedDate =
    (['9', '8', '7'].includes(bill.bill.date[0]) ? '13' : '14') + bill.bill.date;


  const xml = insertXML(
    username,
    password,
    bill.bill.number,
    bill.bill.serial,
    calcCreatedDate,
    bill.bill.weight,
    bill.purchaseId,
    bill.assignmentId,
  );

  if (!bill.assignmentId) {
    throw {
      error: 'عدم وجود شماره تخصیص',
      err: 'عدم وجود شماره تخصیص',
    };
  }

  try {
    const response = await postXML('insertBarname', xml);
    const jsonResponse = await parseXMLToJSON(response.data);

    const result =
      jsonResponse['soap:Envelope']['soap:Body'][0].insertBarnameResponse[0]
        .insertBarnameResult[0]['diffgr:diffgram'][0].NewDataSet[0].Table1;

    if (!result.length) {
      throw {
        error: 'خطا در دریافت اطلاعات',
        err: 'خطا در دریافت اطلاعات',
      };
    }

    if (result?.[0]?.ErrorCode?.[0]) {
      throw {
        error: result?.[0]?.ErrorMsg[0] || 'خطا در دریافت اطلاعات',
        err: result?.[0]?.ErrorMsg[0] || 'خطا در دریافت اطلاعات',
      };
    }

    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
