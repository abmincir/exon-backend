const Model = require('../models/Model');

exports.getAllUsers = (req: any, res: any) => {
  Model.User.find({})
    .exec()
    .then((foundedUsers: any) => res.json({ users: foundedUsers }))
    .catch((err: any) =>
      res.status(422).send({ error: 'we have an issue', err })
    );
};

exports.getUser = (req: any, res: any) => {
  Model.User.findById(req.body._id)
    .exec()
    .then((foundedUser: any) => res.json({ user: foundedUser }))
    .catch((err: any) =>
      res.status(422).send({ error: 'we have an issue', err })
    );
};

exports.auth = (req: any, res: any) => {
  const { username, password } = req.body;
  Model.User.findOne({ username })
    .exec()
    .then((foundedUser: any) => {
      if (foundedUser.password === password) {
        res.json({ user: foundedUser });
      } else {
        res.status(401).send({ error: 'Error In Authentication' });
      }
    })
    .catch((err: any) =>
      res.status(422).send({ error: 'we have an issue', err })
    );
};

exports.createUser = (req: any, res: any) => {
  const { username, name, password } = req.body;
  Model.User.create({ username, name, password }, (err: any, user: any) => {
    if (err) return res.status(422).send({ error: 'we have an issue', err });
    res.json({ user });
  });
};

exports.deleteUser = async (req: any, res: any) => {
  const { _id } = req.body;

  try {
    await Model.User.findByIdAndDelete(_id);
    return res.status(200).send('Success');
  } catch (err: any) {
    return res.status(422).send({ error: 'we have an issue', err });
  }
};

exports.changePassword = (req: any, res: any) => {
  const { username, password, newPassword } = req.body;
  Model.User.findOne({ username })
    .exec()
    .then((foundedUser: any) => {
      if (foundedUser.password === password) {
        foundedUser.password = newPassword;
        foundedUser
          .save()
          .then((savedUser: any) => res.json({ user: savedUser }));
      } else {
        res.status(401).send({ error: 'Error In Authentication' });
      }
    })
    .catch((err: any) =>
      res.status(422).send({ error: 'we have an issue', err })
    );
};

exports.changeUser = async (req: any, res: any) => {
  const { _id, username, name, password } = req.body;

  try {
    const foundedUser = await Model.User.findById(_id).exec();

    foundedUser.username = username ?? foundedUser.username;
    foundedUser.name = name ?? foundedUser.name;
    foundedUser.password = password ?? foundedUser.password;

    const savedUser = await foundedUser.save();
    return res.json({ user: savedUser });
  } catch (err: any) {
    return res.status(422).send({ error: 'we have an issue', err });
  }
};
