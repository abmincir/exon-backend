"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
const BarnameController = require('./controllers/BarnameController');
const UserController = require('./controllers/UserController');
const jsonParser = bodyParser.json();
module.exports = (app) => {
    app.get('/user', jsonParser, UserController.getUser);
    app.post('/user/auth', jsonParser, UserController.auth);
    app.post('/user/create', jsonParser, UserController.createUser);
    app.post('/user/changePassword', jsonParser, UserController.changePassword);
    app.post('/barname/all', jsonParser, BarnameController.getAll);
    app.post('/barname/fetch', jsonParser, BarnameController.getAll);
    app.post('/barname/estelam', jsonParser, BarnameController.estelam);
    app.post('/sql', jsonParser, BarnameController.fetch);
};
