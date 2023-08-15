import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'
import { router } from './router'

import dotenv from 'dotenv'
dotenv.config()

const PORT = process.env.PORT || 3000
const MONGO_URI = 'mongodb://localhost:27017/ExonDb'

mongoose.Promise = global.Promise
mongoose.set('useCreateIndex', true)
mongoose.set('useNewUrlParser', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useUnifiedTopology', true)

mongoose.connect(MONGO_URI).catch((error: any) => {
  console.log('Rejected To Connect To Mongo -> ', error)
})

const app = express()

app.use(express.json())
app.use(cors())

router(app)

app.listen(PORT, () => {
  console.log(`Server Is Running On Port ${PORT}`)
})
