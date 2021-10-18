const {
  Bill,
  Database: DBModel,
  Account: Acc,
  User,
} = require('../models/Model');
const moment = require('jalali-moment');
const SPSWS = require('../services/SPSWSService');
const SQLService = require('../services/SQLService');

exports.estelam = async (req: any, res: any) => {
  const { _id, purchaseId, billNumber, weight, accountId, username } = req.body;

  const foundedAcc = await Acc.findOne({ _id: accountId }).exec();

  if (!foundedAcc || !foundedAcc._id) {
    return res
      .status(400)
      .send({ error: `account ${accountId} does not exists` });
  }
  console.log(' ----------------- foundedAcc ---------------');
  console.log(foundedAcc);
  console.log(' ----------------- foundedAcc ---------------');

  let foundedUser;
  if (username) {
    foundedUser = await User.findOne({ username }).exec();

    if (!foundedUser || !foundedUser._id) {
      return res
        .status(400)
        .send({ error: `account ${username} does not exists` });
    }
  } else {
    foundedUser = { username: 'ADMIN' };
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  try {
    const result = await SPSWS.estelam(
      purchaseId,
      foundedAcc.username,
      foundedAcc.password
    );

    const foundedBill = result.find(
      (bill: any) => bill.billNumber === billNumber
    );

    if (!foundedBill) {
      const doc = await Bill.findById(_id);
      try {
        doc.status = 2;
        doc.account = foundedAcc.title;
        doc.username = foundedUser.username;

        doc.lastMessage = 'بارنامه مورد نظر موجود نیست';
        await doc.save();

        try {
          await SPSWS.insert(
            _id,
            doc,
            foundedAcc.username,
            foundedAcc.password
          );

          doc.lastMessage = 'بارنامه مورد نظر موجود نیست - بارنامه اضافه شد';
          doc.spsWeight = weight;
          doc.status = 1;
          await doc.save();

          return res.send({
            result,
            edit: true,
            message: 'بارنامه مورد نظر موجود نیست - بارنامه اضافه شد',
          });
        } catch (error: any) {
          doc.lastMessage = ' - خطا در ثبت بارنامه - ' + error.err;
          await doc.save();

          return res.status(422).send({
            error: 'we have an issue',
            err: ' - خطا در ثبت بارنامه - ' + error.err,
            insertError: error.err,
          });
        }
      } catch (err: any) {
        return res.status(422).send({ error: 'we have an issue', err });
      }
    }

    if (weight !== foundedBill.weight) {
      try {
        const doc = await Bill.findById(_id);

        doc.spsWeight = foundedBill.weight;
        doc.account = foundedAcc.title;
        doc.username = foundedUser.username;
        doc.status = 0;

        await doc.save();

        try {
          await SPSWS.edit(
            _id,
            doc,
            weight,
            foundedAcc.username,
            foundedAcc.password
          );

          doc.lastMessage = 'عدم تطابق وزن - وزن اصلاح شد';
          doc.spsWeight = weight;
          doc.status = 1;
          await doc.save();

          return res.send({
            result,
            edit: true,
            message: 'عدم تطابق وزن - وزن اصلاح شد',
          });
        } catch (error: any) {
          doc.lastMessage = 'عدم تطابق وزن - خطا در ثبت وزن';
          await doc.save();

          return res.status(422).send({
            error: 'we have an issue',
            err: 'عدم تطابق وزن - خطا در ثبت وزن',
          });
        }
      } catch (err: any) {
        return res.status(422).send({ error: 'we have an issue', err });
      }
    }

    try {
      const doc = await Bill.findById(_id);

      doc.spsWeight = foundedBill.weight;
      doc.spsDraft = foundedBill.draftNumber;
      doc.driver.name = foundedBill.driverName;
      doc.status = 1;
      doc.account = foundedAcc.title;
      doc.username = foundedUser.username;
      doc.lastMessage = 'استعلام موفق - وزن یکسان';

      await doc.save();

      return res.send({ result, edit: true });
    } catch (err: any) {
      return res.status(422).send({ error: 'we have an issue', err });
    }
  } catch (err: any) {
    console.error(err);

    try {
      const doc = await Bill.findById(_id);
      doc.status = 2;
      doc.account = foundedAcc.title;
      doc.username = foundedUser.username;
      doc.lastMessage = 'خطا در اتصال به بازارگاه';

      await doc.save();

      return res
        .status(422)
        .send({ error: 'we have an issue', err: 'خطا در اتصال به بازارگاه' });
    } catch (error: any) {
      return res.status(422).send({ error: 'we have an issue', err });
    }
  }
};

exports.edit = async (req: any, res: any) => {
  const { _id, weight, accountId } = req.body;

  const foundedAcc = await Acc.findOne({ _id: accountId }).exec();

  if (!foundedAcc || !foundedAcc._id) {
    return res
      .status(400)
      .send({ error: `account ${accountId} does not exists` });
  }

  let bill;
  try {
    bill = await Bill.findById(_id);
  } catch (err: any) {
    return res.status(422).send({ error: 'we have an issue', err });
  }

  SPSWS.edit(_id, bill, weight, foundedAcc.username, foundedAcc.password)
    .then((result: any) => {
      return res.send({ result });
    })
    .catch((err: any) => {
      console.log(err);
      res.status(422).send({ error: 'we have an issue', err });
    });
};

exports.getAll = async (req: any, res: any) => {
  let {
    startDateBill,
    endDateBill,
    startDateSave,
    endDateSave,
    billNumber,
    purchaseNumber,
    status,
    productName,
    sort,
    dbId,
  } = req.body;

  const foundedDb = await DBModel.findById(dbId).exec();

  if (!foundedDb || !foundedDb._id) {
    return res.status(400).send({ error: `db ${dbId} does not exists` });
  }

  status = status || status === '0' ? +status : -2;

  console.log('\n-----\nSearching -> ', {
    startDateBill,
    endDateBill,
    startDateSave,
    endDateSave,
    billNumber,
    purchaseNumber,
    status,
    productName,
  });

  let query = {};

  Object.assign(query, { dbName: foundedDb.name });

  if (status !== -2) {
    Object.assign(query, { status });
  }

  if (productName) {
    Object.assign(query, { 'product.name': productName });
  }

  if (billNumber) {
    Object.assign(query, { 'bill.number': billNumber });
  }

  if (purchaseNumber) {
    Object.assign(query, { purchaseId: purchaseNumber });
  }

  if (startDateBill && endDateBill) {
    const startDateG = moment
      .from(startDateBill, 'fa', 'YYYY/MM/DD')
      .locale('en')
      .format('YYYY-M-D HH:mm:ss');

    const endDateG = moment
      .from(endDateBill, 'fa', 'YYYY/MM/DD')
      .locale('en')
      .format('YYYY-M-D HH:mm:ss');

    Object.assign(query, {
      date: {
        $gte: new Date(startDateG),
        $lte: new Date(endDateG),
      },
    });
  } else if (startDateBill) {
    const startDateG = moment
      .from(startDateBill, 'fa', 'YYYY/MM/DD')
      .locale('en')
      .format('YYYY-M-D HH:mm:ss');

    Object.assign(query, {
      date: {
        $gte: new Date(startDateG),
      },
    });
  }

  if (startDateSave && endDateSave) {
    const startDateG = moment
      .from(startDateSave, 'fa', 'YYYY/MM/DD')
      .locale('en')
      .format('YYYY-M-D HH:mm:ss');

    const endDateG = moment
      .from(endDateSave, 'fa', 'YYYY/MM/DD')
      .locale('en')
      .format('YYYY-M-D HH:mm:ss');

    Object.assign(query, {
      created: {
        $gte: new Date(startDateG),
        $lte: new Date(endDateG),
      },
    });
  } else if (startDateSave) {
    const startDateG = moment
      .from(startDateSave, 'fa', 'YYYY/MM/DD')
      .locale('en')
      .format('YYYY-M-D HH:mm:ss');

    Object.assign(query, {
      created: {
        $gte: new Date(startDateG),
      },
    });
  }

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
  } = sort;

  let sortObj = {};

  if (purchaseId !== 0) {
    Object.assign(sortObj, { purchaseId });
  }

  if (spsWeight !== 0) {
    Object.assign(sortObj, { spsWeight });
  }

  if (saveDate !== 0) {
    Object.assign(sortObj, { date: saveDate });
  }

  if (billWeight !== 0) {
    Object.assign(sortObj, { 'bill.weight': billWeight });
  }

  if (billDate !== 0) {
    Object.assign(sortObj, { 'bill.date': billDate });
  }

  if (billSerial !== 0) {
    Object.assign(sortObj, { 'bill.serial': billSerial });
  }

  if (billNumberSort !== 0) {
    Object.assign(sortObj, { 'bill.number': billNumberSort });
  }

  if (productNameSort !== 0) {
    Object.assign(sortObj, { 'product.name': productNameSort });
  }

  if (customerName !== 0) {
    Object.assign(sortObj, { 'customer.name': customerName });
  }

  if (billStatus !== 0) {
    Object.assign(sortObj, { status: billStatus });
  }

  Bill.find(query)
    .limit(1000)
    .sort(sortObj)
    .exec()
    .then((foundedBill: any) => res.json({ bill: foundedBill }))
    .catch((err: any) =>
      res.status(422).send({ error: 'we have an issue', err })
    );
};

exports.fetch = (req: any, res: any) => {
  const { startDate, endDate } = req.body;

  SQLService.FetchTadbirData({ startDate, endDate }).then(
    (result: any) => {
      console.log(result);
      res.send(result);
    },
    (error: any) => console.error(error)
  );
};

exports.dummy = (req: any, res: any) => {
  SQLService.MockData().then(
    (result: any) => {
      console.log(result);
      res.send(result);
    },
    (error: any) => console.error(error)
  );
};

exports.updateDb = async (req: any, res: any) => {
  let { startDate, endDate, dbId } = req.body;

  console.log({
    startDate,
    endDate,
    dbId,
  });

  if (!startDate || !endDate) {
    startDate = moment().locale('fa').format('YYYY/MM/DD');
    endDate = moment().locale('fa').add(1, 'day').format('YYYY/MM/DD');
  }

  const startDateMiladi = moment
    .from(startDate, 'fa', 'YYYY/MM/DD')
    .locale('en')
    .format('YYYY-MM-DD');

  const endDateMiladi = moment
    .from(endDate, 'fa', 'YYYY/MM/DD')
    .locale('en')
    .format('YYYY-MM-DD');

  const startDateMongo = moment
    .from(startDate, 'fa', 'YYYY/MM/DD')
    .locale('en')
    .format('YYYY-M-D HH:mm:ss');

  const endDateMongo = moment
    .from(endDate, 'fa', 'YYYY/MM/DD')
    .locale('en')
    .format('YYYY-M-D HH:mm:ss');

  console.log('+++++++++++++++++');

  console.log('Start Date Is -> ', {
    startDate,
    startDateMongo,
    startDateMiladi,
    dateObj: new Date(startDateMongo),
  });
  console.log('-----------------');
  console.log('End Date Is -> ', {
    endDate,
    endDateMongo,
    endDateMiladi,
    dateObj: new Date(endDateMongo),
  });

  console.log('+++++++++++++++++');

  try {
    // const result = await SQLService.MockData({
    const result: any[] = await SQLService.FetchData({
      startDate,
      endDate,
      startDateMiladi,
      endDateMiladi,
      dbId,
    });

    const foundedDb = await DBModel.findById(dbId).exec();

    if (!foundedDb || !foundedDb._id) {
      return res.status(400).send({ error: `db ${dbId} does not exists` });
    }

    let savedBills = 0;
    let saveErrors = 0;
    let alreadySavedBills = 0;

    for (let i = 0; i < result.length; i++) {
      let bill = result[i];

      const calculatedDate =
        (bill.barDate[0] === '9' ||
        bill.barDate[0] === '8' ||
        bill.barDate[0] === '7' ||
        bill.barDate[0] === '6'
          ? '13'
          : '14') + bill.barDate;
      const mongoDate = new Date(
        moment
          .from(calculatedDate, 'fa', 'YYYY/MM/DD')
          .locale('en')
          .format('YYYY-M-D HH:mm:ss')
      );

      const calcCreatedDate =
        (bill.RegisterDate[0] === '9' ||
        bill.RegisterDate[0] === '8' ||
        bill.RegisterDate[0] === '7'
          ? '13'
          : '14') + bill.RegisterDate;
      const mongoCreatedDate = new Date(
        moment
          .from(calcCreatedDate, 'fa', 'YYYY/MM/DD')
          .locale('en')
          .format('YYYY-M-D HH:mm:ss')
      );

      const b = new Bill({
        allocationId: bill.ref,
        purchaseId: bill.bargah, //spsId
        saveDate: bill.RegisterDate,
        dbName: foundedDb.name, // Origin Sql Database Name That Is Unique

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
          id: bill.Barno + '@' + bill.barnoCode,
          row: bill.serial,
          number: bill.Barno.split('-')[0],
          serial: bill.Barno.split('-')[1],
          weight: bill.weight,
          date: bill.barDate,
        },

        date: mongoDate,
        created: mongoCreatedDate,
      });

      try {
        const fB = await Bill.find({
          'bill.id': bill.Barno + '@' + bill.barnoCode,
        }).exec();

        if (fB.length === 0) {
          try {
            await b.save();
            savedBills += 1;
          } catch (saveError: any) {
            saveErrors += 1;
            console.error('not saved -> error: ', saveError);
          }
        } else {
          console.log('not saved found');
          alreadySavedBills += 1;
        }
      } catch (findError: any) {
        console.log('Had Error Finding The Bill');
      }
    }

    let query = {};

    if (startDate && endDate) {
      const startDateG = moment
        .from(startDate, 'fa', 'YYYY/MM/DD')
        .locale('en')
        .format('YYYY-M-D HH:mm:ss');

      const endDateG = moment
        .from(endDate, 'fa', 'YYYY/MM/DD')
        .locale('en')
        .format('YYYY-M-D HH:mm:ss');

      Object.assign(query, {
        created: {
          $gte: new Date(startDateG),
          $lte: new Date(endDateG),
        },
      });
    } else if (startDate) {
      const startDateG = moment
        .from(startDate, 'fa', 'YYYY/MM/DD')
        .locale('en')
        .format('YYYY-M-D HH:mm:ss');

      Object.assign(query, {
        created: {
          $gte: new Date(startDateG),
        },
      });
    }

    const foundedBill = await Bill.find(query).sort().exec();

    console.log('----------- Update Db Result -----------');
    console.log({
      savedBills,
      alreadySavedBills,
      saveErrors,
      misNumber: result.length,
      queryNumber: foundedBill.length,
    });
    console.log('----------- Update Db Result -----------');

    return res.json({ bill: foundedBill });
  } catch (err: any) {
    console.error(' --------- SQL ERROR ', err);
    res.status(422).send({ error: 'we have an issue', err });
  }
};
