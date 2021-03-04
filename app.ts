import express from 'express';

const router = require('./router');
const mongoose = require('mongoose');
const cors = require('cors');

// Creating Connection To Mongo Database
mongoose.Promise = global.Promise;
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect('mongodb://localhost:27017/ExonDb').catch((error: any) => {
  console.log('Rejected To Connect To Mongo -> ', error);
});

// initialize app
const app = express();

// enabling CORS
app.use(cors());

// adding routes
router(app);

// listen for requests
app.listen(3000, () => {
  console.log('Server Is Running On Port 3000');
});

//! move this to a service
app.get('/sql', function (req, res) {
  const sql = require('mssql');

  // config for your database
  const config = {
    user: 'sa',
    password: 'mis',
    server: 'srv-siniran\\SRV_SINIRAN',
    database: 'XData',
  };

  // connect to your database
  sql.connect(config, (err: Error) => {
    if (err) console.log(err);

    // create Request object
    var request = new sql.Request();

    // query to the database and get the records
    request.query(``, (error: Error, recordSet: any) => {
      if (error) console.log(error);

      // send records as a response
      res.send(recordSet);
    });
  });
});
