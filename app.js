"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = require('./router');
const mongoose = require('mongoose');
const cors = require('cors');
// Creating Connection To Mongo Database
mongoose.Promise = global.Promise;
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
// Connecting To Mongodb
mongoose.connect('mongodb://localhost:27017/ExonDb').catch((error) => {
    console.log('Rejected To Connect To Mongo -> ', error);
});
// initialize app
const app = express_1.default();
// enabling CORS
app.use(cors());
// adding routes
router(app);
// listen for requests
app.listen(3000, () => {
    console.log('Server Is Running On Port 3000');
});
