"use strict";
const Model = require('../models/Model');
exports.getUser = (req, res) => {
    Model.User.findById(req.body._id)
        .exec()
        .then((foundedUser) => res.json({ user: foundedUser }))
        .catch((err) => res.status(422).send({ error: 'we have an issue', err }));
};
exports.auth = (req, res) => {
    const { username, password } = req.body;
    Model.User.findOne({ username })
        .exec()
        .then((foundedUser) => {
        if (foundedUser.password === password) {
            res.json({ user: foundedUser });
        }
        else {
            res.status(401).send({ error: 'Error In Authentication' });
        }
    })
        .catch((err) => res.status(422).send({ error: 'we have an issue', err }));
};
exports.createUser = (req, res) => {
    const { username, password } = req.body;
    Model.User.create({ username, password }, (err, user) => {
        if (err)
            return res.status(422).send({ error: 'we have an issue', err });
        res.json({ user });
    });
};
exports.changePassword = (req, res) => {
    const { username, password, newPassword } = req.body;
    Model.User.findOne({ username })
        .exec()
        .then((foundedUser) => {
        if (foundedUser.password === password) {
            foundedUser.password = newPassword;
            foundedUser
                .save()
                .then((savedUser) => res.json({ user: savedUser }));
        }
        else {
            res.status(401).send({ error: 'Error In Authentication' });
        }
    })
        .catch((err) => res.status(422).send({ error: 'we have an issue', err }));
};
