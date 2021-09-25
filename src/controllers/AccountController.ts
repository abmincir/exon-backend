const { Account } = require('../models/Model');

exports.getAll = async (req: any, res: any) => {
  Account.find({})
    .exec()
    .then((foundedAccounts: any) => res.json({ accounts: foundedAccounts }))
    .catch((err: any) =>
      res.status(422).send({ error: 'we have an issue', err })
    );
}

exports.create = async (req: any, res: any) => {
  const { username, password } = req.body;

  const foundAccount = await Account.findOne({ username }).exec();
  if (foundAccount && foundAccount._id) {
    return res.status(400).send({ error: `username ${username} already exists` });
  }

  Account.create({ username, password }, (err: any, account: any) => {
    if (err) {
      return res.status(422).send({ error: 'create account has error', err });
    }

    return res.json({ account });
  })
}

exports.update = async (req: any, res: any) => {
  const { _id, username, password } = req.body;

  const foundedAccount = await Account.findById(_id).exec();
  if (!foundedAccount || !foundedAccount._id) {
    return res.status(400).send({ error: `user ${_id} does not exists` });
  }

  foundedAccount.username = username;
  foundedAccount.password = password;

  const updatedAccount = await foundedAccount.save();

  return res.json({ account: updatedAccount });
}

exports.delete = async (req: any, res: any) => {
  const { _id } = req.body;

  Account.findByIdAndDelete(_id, (err: any, docs: any) => {
    if (err) {
      return res.status(422).send({ error: 'we have an issue', err });
    }

    return res.status(201).send('Success');
  });
}
