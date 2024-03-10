import moment from 'jalali-moment'

import { Bill } from '../models/bill.model'
import { Draft } from '../models/draft.model';

import { edit, insert } from '../services/SPSWSService'

const handleBillNotFound = async (_id: string, weight: number, foundedAcc: any, foundedUser: any) => {
  const bill = await Bill.findById(_id)

  if (!bill) {
    throw new Error('Bill Not Found')
  }

  bill.status = 2
  bill.account = foundedAcc.title
  bill.username = foundedUser.username
  bill.lastMessage = 'بارنامه مورد نظر موجود نیست'

  await bill.save()
  await insert(_id, bill, foundedAcc.username, foundedAcc.password)

  bill.lastMessage = 'بارنامه مورد نظر موجود نیست - بارنامه اضافه شد'
  bill.spsWeight = weight + ''
  bill.status = 1

  await bill.save()
}

const handleWeightMismatch = async (
  _id: string,
  weight: number,
  foundedBill: any,
  foundedAcc: any,
  foundedUser: any,
) => {
  const bill = await Bill.findById(_id)

  if (!bill) {
    throw new Error('Bill Not Found')
  }

  bill.spsWeight = foundedBill.weight
  bill.account = foundedAcc.title
  bill.username = foundedUser.username
  bill.status = 0

  await bill.save()
  await edit(_id, bill, weight + '', foundedAcc.username, foundedAcc.password)

  bill.lastMessage = 'عدم تطابق وزن - وزن اصلاح شد'
  bill.spsWeight = weight + ''
  bill.status = 1

  await bill.save()
}

const handleMatchingWeight = async (_id: string, foundedBill: any, foundedAcc: any, foundedUser: any) => {
  const bill = await Bill.findById(_id)

  if (!bill) {
    throw new Error('Bill Not Found')
  }

  bill.spsWeight = foundedBill.weight
  bill.spsDraft = foundedBill.draftNumber
  bill.driver.name = foundedBill.driverName
  bill.status = 1
  bill.account = foundedAcc.title
  bill.username = foundedUser.username
  bill.lastMessage = 'استعلام موفق - وزن یکسان'

  await bill.save()
}

const createDateQuery = (startDate: string, endDate: string) => {
  if (!startDate) return null

  const startDateG = moment.from(startDate, 'fa', 'YYYY/MM/DD').locale('en').format('YYYY-M-D HH:mm:ss')
  if (!endDate) {
    return {
      $gte: new Date(startDateG),
    }
  }

  const endDateG = moment.from(endDate, 'fa', 'YYYY/MM/DD').locale('en').format('YYYY-M-D HH:mm:ss')
  return {
    $gte: new Date(startDateG),
    $lte: new Date(endDateG),
  }
}

const createSortObject = (sort: any) => {
  const {
    purchaseId,
    spsWeight,
    saveDate,
    billWeight,
    billDate,
    billSerial,
    billNumber: billNumberSort,
    productName: productNameSort,
    customerName,
    billStatus,
  } = sort

  return {
    ...(purchaseId && { purchaseId }),
    ...(spsWeight && { spsWeight }),
    ...(saveDate && { date: saveDate }),
    ...(billWeight && { 'bill.weight': billWeight }),
    ...(billDate && { 'bill.date': billDate }),
    ...(billSerial && { 'bill.serial': billSerial }),
    ...(billNumberSort && { 'bill.number': billNumberSort }),
    ...(productNameSort && { 'product.name': productNameSort }),
    ...(customerName && { 'customer.name': customerName }),
    ...(billStatus && { status: billStatus }),
  }
}

const createHamlSortObject = (sort: any) => {
  const {
    date: dateSort,
    hamlCode: hamlCodeSort,
    kotaj: kotajSort,
    shipRecno: shipRecnoSort,
    recno: recnoSort,
    meli: meliSort,
    tarekh: tarekhSort,
    peygiri: peygiriSort,
    shenaseh: shenasehSort
  } = sort;

  return {
    ...(dateSort && { date: dateSort }),
    ...(hamlCodeSort && { hamlCode: hamlCodeSort }),
    ...(kotajSort && { kotaj: kotajSort }),
    ...(shipRecnoSort && { shipRecno: shipRecnoSort }),
    ...(recnoSort && { recno: recnoSort }),
    ...(meliSort && { meli: meliSort }),
    ...(tarekhSort && { tarekh: tarekhSort }),
    ...(peygiriSort && { peygiri: peygiriSort }),
    ...(shenasehSort && { shenaseh: shenasehSort })
  };
};


const formatDate: (date: string) => { miladi: string; mongo: string } = (date: string) => {
  return {
    miladi: moment.from(date, 'fa', 'YYYY/MM/DD').locale('en').format('YYYY-MM-DD'),
    mongo: moment.from(date, 'fa', 'YYYY/MM/DD').locale('en').format('YYYY-M-D HH:mm:ss'),
  }
}

const createDraftInstance = (draftData: any, dbName: string) => {
  const calculatedDate = (['9', '8', '7', '6'].includes(draftData.tarekh[0]) ? '13' : '14') + draftData.saveDate;
  const mongoDate = new Date(moment.from(calculatedDate, 'fa', 'YYYY/MM/DD').locale('en').format('YYYY-M-D HH:mm:ss'));

  return new Draft({
    ...draftData,
    dbName: dbName,
    date: mongoDate,
    status: draftData.status ?? -1,
  });
};


const createBillInstance = (bill: any, dbName: string) => {
  const calculatedDate = (['9', '8', '7', '6'].includes(bill.barDate[0]) ? '13' : '14') + bill.barDate
  const mongoDate = new Date(moment.from(calculatedDate, 'fa', 'YYYY/MM/DD').locale('en').format('YYYY-M-D HH:mm:ss'))

  const calcCreatedDate = (['9', '8', '7'].includes(bill.RegisterDate[0]) ? '13' : '14') + bill.RegisterDate
  const mongoCreatedDate = new Date(
    moment.from(calcCreatedDate, 'fa', 'YYYY/MM/DD').locale('en').format('YYYY-M-D HH:mm:ss'),
  )

  return new Bill({
    allocationId: bill.ref,
    purchaseId: bill.bargah,
    saveDate: bill.RegisterDate,
    dbName,

    cottageNumber: bill.cottage_id,
    assignmentId: bill.ref,

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
      id: !!bill.Barno && !!bill.barnoCode ? bill.Barno + '@' + bill.barnoCode : 'ناموجود',
      row: bill.serial ?? 'ناموجود',
      number: bill.Barno ? bill.Barno.split('-')[0] : 'ناموجود',
      serial: bill.Barno ? bill.Barno.split('-')[1] : 'ناموجود',
      weight: bill.weight ?? 'ناموجود',
      date: bill.barDate ?? 'ناموجود',
    },

    date: mongoDate,
    created: mongoCreatedDate,
  })
}

export {
  createBillInstance,
  createDraftInstance,
  createDateQuery,
  createHamlSortObject,
  createSortObject,
  formatDate,
  handleBillNotFound,
  handleMatchingWeight,
  handleWeightMismatch,
}
