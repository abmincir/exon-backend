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
  await Model.User.findByIdAndDelete(_id).catch((err: any) =>
    res.status(422).send({ error: 'we have an issue', err })
  );
  res.status(200).send('Success');
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

exports.changeUser = (req: any, res: any) => {
  const { username, newUsername, name, password } = req.body;
  Model.User.findOne({ username })
    .exec()
    .then((foundedUser: any) => {
      foundedUser.username = newUsername || foundedUser.username;
      foundedUser.name = name || foundedUser.name;
      foundedUser.password = password || foundedUser.password;
      foundedUser
        .save()
        .then((savedUser: any) => res.json({ user: savedUser }));
    })
    .catch((err: any) =>
      res.status(422).send({ error: 'we have an issue', err })
    );
};
