require('dotenv').config()
const Doctor = require('./models/doctorModel.js')
const Symptom = require('./models/symptomModel.js')

const cors = require('cors');
const express = require('express')
const mongoose = require('mongoose')
const doctors = require('./routes/doctors.js')

const app = express()

app.use(express.json())

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

app.use(cors({
  origin : "*",
}));

app.use('/api/doctors', doctors)

mongoose.set('strictQuery', true);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log('Listening to port');
    })  
  })
  .catch((error) => {
    console.log(error)
  })
