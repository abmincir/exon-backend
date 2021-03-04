import bodyParser = require('body-parser');
const BarnameController = require('./controllers/BarnameController');
const UserController = require('./controllers/UserController');

const jsonParser = bodyParser.json();

module.exports = (app: any) => {
  app.get('/user', jsonParser, UserController.getUser);
  app.post('/user/auth', jsonParser, UserController.auth);
  app.post('/user/create', jsonParser, UserController.createUser);
  app.post('/user/changePassword', jsonParser, UserController.changePassword);

  app.post('/barname/all', jsonParser, BarnameController.getAll);
  app.post('/barname/fetch', jsonParser, BarnameController.getAll);

  app.post('/barname/estelam', jsonParser, BarnameController.estelam);
  // app.get(
  //   '/purchase/get/own/purchases',
  //   jsonParser,
  //   PurchaseController.getOwnPurchases
  // );
  // app.get(
  //   '/purchase/get/all/purchases',
  //   jsonParser,
  //   PurchaseController.getAllPurchases
  // );
  // app.get(
  //   '/purchase/get/unverified/purchases',
  //   jsonParser,
  //   PurchaseController.getAllUnverified
  // );
  // app.post('/purchase/refund', jsonParser, PurchaseController.refund);
  // app.post(
  //   '/purchase/send/zarinpal',
  //   jsonParser,
  //   PurchaseController.payPurchase
  // );
  // app.post('/purchase/check/zarinpal', jsonParser, PurchaseController.checkPay);
};
