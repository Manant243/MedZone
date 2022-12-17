require('dotenv').config()
const Doctor = require('./models/doctorModel.js')
const Symptom = require('./models/symptomModel.js')


const express = require('express')
const mongoose = require('mongoose')
const doctors = require('./routes/doctors.js')

const app = express()

app.use(express.json())

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

app.use('/api/doctors', doctors)

mongoose.set('strictQuery', true);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {        
        console.log('Listening on port 4000')
    })  
  })
  .catch((error) => {
    console.log(error)
  })
