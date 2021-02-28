const { Barname } = require('../models/Model');
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
  let query = {};

  Barname.find(query)
    .limit(60)
    // todo sort by date
    .sort({ _id: -1 })
    .exec()
    .then((foundedBarname: any) => res.json({ barname: foundedBarname }))
    .catch((err: any) =>
      res.status(422).send({ error: 'we have an issue', err })
    );
};
