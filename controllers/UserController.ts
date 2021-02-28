const Model = require('../models/Model');

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
  const { username, password } = req.body;
  Model.User.create({ username, password }, (err: any, user: any) => {
    if (err) return res.status(422).send({ error: 'we have an issue', err });
    res.json({ user });
  });
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
