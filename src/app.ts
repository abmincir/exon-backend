import express from 'express';

const cors = require('cors');
const router = require('./router');
const mongoose = require('mongoose');

// Creating Connection To Mongo Database
mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);

// Connecting To Mongodb
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
app.listen(3001, () => {
  console.log('Server Is Running On Port 3000');
});
