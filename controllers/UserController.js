"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const Model = require('../models/Model');
exports.getAllUsers = (req, res) => {
    Model.User.find({})
        .exec()
        .then((foundedUsers) => res.json({ users: foundedUsers }))
        .catch((err) => res.status(422).send({ error: 'we have an issue', err }));
};
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
    const { username, name, password } = req.body;
    Model.User.create({ username, name, password }, (err, user) => {
        if (err)
            return res.status(422).send({ error: 'we have an issue', err });
        res.json({ user });
    });
};
exports.deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.body;
    try {
        yield Model.User.findByIdAndDelete(_id);
        return res.status(200).send('Success');
    }
    catch (err) {
        return res.status(422).send({ error: 'we have an issue', err });
    }
});
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
exports.changeUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id, username, name, password } = req.body;
    try {
        const foundedUser = yield Model.User.findById(_id).exec();
        foundedUser.username = username !== null && username !== void 0 ? username : foundedUser.username;
        foundedUser.name = name !== null && name !== void 0 ? name : foundedUser.name;
        foundedUser.password = password !== null && password !== void 0 ? password : foundedUser.password;
        const savedUser = yield foundedUser.save();
        return res.json({ user: savedUser });
    }
    catch (err) {
        return res.status(422).send({ error: 'we have an issue', err });
    }
});
