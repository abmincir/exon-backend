const { Barname } = require('../models/Model');
const moment = require('jalali-moment');
const SPSWS = require('../services/SPSWSService');

exports.estelam = async (req: any, res: any) => {
  const { Amount, CallbackURL, Description, Email, Mobile } = req.body;
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  SPSWS.estelam({ Amount, CallbackURL, Description, Email, Mobile })
    .then((result: any) => {
      console.log(result);
      return res.send({ result });
    })
    .catch((err: any) =>
      res.status(422).send({ error: 'we have an issue', err })
    );
};

exports.edit = async (req: any, res: any) => {
  const { Amount, CallbackURL, Description, Email, Mobile } = req.body;
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

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
