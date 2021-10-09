const { Database } = require('../models/Model');

exports.getAll = async (req: any, res: any) => {
  Database.find({})
    .exec()
    .then((foundedDbs: any) => res.json({ dbs: foundedDbs }))
    .catch((err: any) =>
      res.status(422).send({ error: 'we have an issue', err })
    );
};

exports.create = async (req: any, res: any) => {
  const { name, username, password, address, proc, isShamsi } = req.body;

  const foundDb = await Database.findOne({ name }).exec();
  if (foundDb && foundDb._id) {
    return res.status(400).send({ error: `db ${name} already exists` });
  }

  Database.create(
    { name, username, password, address, proc, isShamsi },
    (err: any, db: any) => {
      if (err) {
        return res.status(422).send({ error: 'create db has error', err });
      }

      return res.json({ db });
    }
  );
};

exports.update = async (req: any, res: any) => {
  const { name, username, password, address, proc, isShamsi } = req.body;

  const foundedDatabase = await Database.findOne({ name }).exec();
  if (!foundedDatabase || !foundedDatabase._id) {
    return res.status(400).send({ error: `db ${name} does not exists` });
  }

  foundedDatabase.name = name;
  foundedDatabase.username = username;
  foundedDatabase.password = password;
  foundedDatabase.address = address;
  foundedDatabase.proc = proc;
  foundedDatabase.isShamsi = isShamsi;

  const updatedDatabase = await foundedDatabase.save();

  return res.json({ db: updatedDatabase });
};

exports.delete = async (req: any, res: any) => {
  const { _id } = req.body;

  Database.findByIdAndDelete(_id, (err: any, docs: any) => {
    if (err) {
      return res.status(422).send({ error: 'we have an issue', err });
    }

    return res.status(201).send('Success');
  });
};
