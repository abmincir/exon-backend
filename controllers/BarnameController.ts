const { Barname } = require('../models/Model');
const moment = require('jalali-moment');
const SPSWS = require('../services/SPSWSService');
const SQLService = require('../services/SQLService');

exports.estelam = async (req: any, res: any) => {
  const { userName, pass, kharidId, toDate, fromDate } = req.body;

  SPSWS.estelam({ userName, pass, kharidId, toDate, fromDate })
    .then((result: any) => {
      return res.send({});
    })
    .catch((err: any) =>
      res.status(422).send({ error: 'we have an issue', err })
    );
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
  let { startDate, endDate } = req.body;

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

  let query = {
    date: {
      $gte: new Date(startDateG),
      $lt: new Date(endDateG),
    },
  };

  Barname.find(query)
    .limit(60)
    .sort({ date: 1 })
    .exec()
    .then((foundedBarname: any) => res.json({ barname: foundedBarname }))
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
    const result = await SQLService.FetchData({
      startDate: startDateSql,
      endDate: endDateSql,
    });

    console.log(result);

    const newBarname = new Barname({});

    Barname.insertMany([], (err: any) => {
      console.log(err);
    });

    // res.send(result);
  } catch (error: any) {
    console.error(error);
  }

  let query = {
    date: {
      $gte: new Date(startDateMongo),
      $lt: new Date(endDateMongo),
    },
  };

  Barname.find(query)
    .limit(60)
    .sort({ date: 1 })
    .exec()
    .then((foundedBarname: any) => res.json({ barname: foundedBarname }))
    .catch((err: any) =>
      res.status(422).send({ error: 'we have an issue', err })
    );
};
