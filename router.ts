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
  app.post('/barname/update-db', jsonParser, BarnameController.updateDb);

  app.post('/barname/estelam', BarnameController.estelam);

  app.post('/sql', jsonParser, BarnameController.fetch);
  app.post('/test', jsonParser, BarnameController.dummy);
};
