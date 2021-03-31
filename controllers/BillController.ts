const { Bill } = require('../models/Model');
const moment = require('jalali-moment');
const SPSWS = require('../services/SPSWSService');
const SQLService = require('../services/SQLService');

exports.estelam = async (req: any, res: any) => {
  const { _id, purchaseId, billNumber, weight } = req.body;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  try {
    const result = await SPSWS.estelam(purchaseId);

    const foundedBill = result.find(
      (bill: any) => bill.billNumber === billNumber
    );

    if (foundedBill === null || foundedBill === undefined) {
      const doc = await Bill.findById(_id);
      try {
        doc.status = 2;

        await doc.save();

        return res.status(422).send({
          error: 'we have an issue',
          err: 'بارنامه مورد نظر موجود نیست',
        });
      } catch (err: any) {
        return res.status(422).send({ error: 'we have an issue', err });
      }
    }

    if (weight !== foundedBill.weight) {
      try {
        const doc = await Bill.findById(_id);

        doc.cottageNumber = foundedBill.cottageNumber;
        doc.spsWeight = foundedBill.weight;
        doc.status = 0;

        await doc.save();

        return res.status(422).send({
          error: 'we have an issue',
          err: 'عدم تطابق وزن',
        });
      } catch (err: any) {
        return res.status(422).send({ error: 'we have an issue', err });
      }
    }

    try {
      const doc = await Bill.findById(_id);

      doc.cottageNumber = foundedBill.cottageNumber;
      doc.spsWeight = foundedBill.weight;
      doc.spsDraft = foundedBill.draftNumber;
      doc.driver.name = foundedBill.driverName;
      doc.status = 1;

      await doc.save();

      return res.send({ result });
    } catch (err: any) {
      return res.status(422).send({ error: 'we have an issue', err });
    }
  } catch (err: any) {
    console.error(err);
    return res.status(422).send({ error: 'we have an issue', err });
  }
};

exports.edit = async (req: any, res: any) => {
  const { _id, weight } = req.body;

  let bill;
  try {
    bill = await Bill.findById(_id);
  } catch (err: any) {
    return res.status(422).send({ error: 'we have an issue', err });
  }

  SPSWS.edit(_id, bill, weight)
    .then((result: any) => {
      return res.send({ result });
    })
    .catch((err: any) =>
      res.status(422).send({ error: 'we have an issue', err })
    );
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
  } = req.body;

  status = status || status === '0' ? +status : -2;

  console.log('\n-----\nSearching -> ', {
    startDateBill,
    endDateBill,
    startDateSave,
    endDateSave,
    billNumber,
    purchaseNumber,
    status,
  });

  let query = {};

  if (status !== -2) {
    Object.assign(query, { status });
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

  Bill.find(query)
    .limit(1000)
    .sort({ date: 1 })
    .exec()
    .then((foundedBill: any) => res.json({ bill: foundedBill }))
    .catch((err: any) =>
      res.status(422).send({ error: 'we have an issue', err })
    );
};

exports.fetch = (req: any, res: any) => {
  const { startDate, endDate } = req.body;

  SQLService.FetchData({ startDate, endDate }).then(
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
  let { startDate, endDate } = req.body;

  if (!startDate || !endDate) {
    startDate = moment().locale('fa').format('YYYY/MM/DD');
    endDate = moment().locale('fa').add(1, 'day').format('YYYY/MM/DD');
  }

  const startDateSql = startDate.substring(2);
  const endDateSql = endDate.substring(2);

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
    startDateSql,
    startDateMongo,
    dateObj: new Date(startDateMongo),
  });
  console.log('-----------------');
  console.log('End Date Is -> ', {
    endDate,
    endDateSql,
    endDateMongo,
    dateObj: new Date(endDateMongo),
  });

  console.log('+++++++++++++++++');

  try {
    // const result = await SQLService.MockData({
    const result = await SQLService.FetchData({
      startDate: startDateSql,
      endDate: endDateSql,
    });

    const bills = [...result].map((bill) => {
      const calculatedDate =
        (bill.barDate[0] === '9' ||
        bill.barDate[0] === '8' ||
        bill.barDate[0] === '7'
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
      return new Bill({
        allocationId: bill.ref,
        purchaseId: bill.bargah, //spsId
        saveDate: bill.RegisterDate,

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
    });

    Bill.insertMany(bills, { ordered: false, silent: true })
      .then((savedBills: any) => {
        console.log(bills.length, savedBills.length);
      })
      .catch((error: any) => {
        if (error) {
          console.error(error);
        }
      })
      .finally(() => {
        let query = {
          created: {
            $gte: new Date(startDateMongo),
            $lte: new Date(endDateMongo),
          },
        };

        Bill.find(query)
          // .limit(60)
          .sort({ date: 1 })
          .exec()
          .then((foundedBill: any) => res.json({ bill: foundedBill }))
          .catch((err: any) =>
            res.status(422).send({ error: 'we have an issue', err })
          );
      });
  } catch (error: any) {
    console.error(error);
  }
};
