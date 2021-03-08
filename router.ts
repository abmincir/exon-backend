import bodyParser = require('body-parser');
const BillController = require('./controllers/BillController');
const UserController = require('./controllers/UserController');

const jsonParser = bodyParser.json();

module.exports = (app: any) => {
  app.get('/user', jsonParser, UserController.getUser);
  app.post('/user/auth', jsonParser, UserController.auth);
  app.post('/user/create', jsonParser, UserController.createUser);
  app.post('/user/changePassword', jsonParser, UserController.changePassword);

  app.post('/bill/all', jsonParser, BillController.getAll);
  app.post('/bill/fetch', jsonParser, BillController.getAll);
  app.post('/bill/update-db', jsonParser, BillController.updateDb);

  app.post('/bill/estelam', jsonParser, BillController.estelam);

  app.post('/sql', jsonParser, BillController.fetch);
  app.post('/test', jsonParser, BillController.dummy);
};
