const { Bill } = require('../models/Model');
const moment = require('jalali-moment');
const SPSWS = require('../services/SPSWSService');
const SQLService = require('../services/SQLService');

exports.estelam = async (req: any, res: any) => {
  // const { userName, pass, kharidId, toDate, fromDate } = req.body;

  try {
    const result = await SPSWS.estelam({
      // userName,
      // pass,
      // kharidId,
      // toDate,
      // fromDate,
    });
    res.send({ result });
  } catch (error: any) {
    console.error(error);
  }
};

exports.edit = async (req: any, res: any) => {
  const { Amount, CallbackURL, Description, Email, Mobile } = req.body;

  SPSWS.estelam({ Amount, CallbackURL, Description, Email, Mobile })
    .then((result: any) => {
      console.log(result);
      return res.send({ result });
    })
    .catch((err: any) =>
      res.status(422).send({ error: 'we have an issue', err })
    );
};

exports.getAll = async (req: any, res: any) => {
  let { startDate, endDate, billNumber } = req.body;

  if (!startDate || !endDate) {
    startDate = moment().locale('fa').format('YYYY/MM/DD');
    endDate = moment().locale('fa').add(1, 'day').format('YYYY/MM/DD');
  }

  const startDateG = moment
    .from(startDate, 'fa', 'YYYY/MM/DD')
    .locale('en')
    .format('YYYY-M-D HH:mm:ss');

  const endDateG = moment
    .from(endDate, 'fa', 'YYYY/MM/DD')
    .locale('en')
    .format('YYYY-M-D HH:mm:ss');

  console.log('Start Date Is -> ', startDate, startDateG, new Date(startDateG));
  console.log('-----------------');
  console.log('End Date Is -> ', endDate, endDateG, new Date(endDateG));

  let query =
    billNumber && billNumber.length
      ? {
          bill: {
            number: billNumber,
          },
        }
      : {
          date: {
            $gte: new Date(startDateG),
            $lte: new Date(endDateG),
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
    const result = await SQLService.MockData({
      // const result = await SQLService.FetchData({
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

      console.log(bill.Barno + '@' + bill.barnoCode, mongoDate);

      return new Bill({
        allocationId: bill.ref,
        purchaseId: bill.bargah, //spsId

        salesmanCode: bill.code,
        carNumber: bill.Carno,
        telephone: bill.tel,

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
      });
    });

    Bill.insertMany(bills)
      .then((savedBills: any) => {
        console.log(bills.length, savedBills.length);

        let query = {
          date: {
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
      })
      .catch((error: any) => {
        if (error) {
          console.error(error);
        }
      });
  } catch (error: any) {
    console.error(error);
  }
};
