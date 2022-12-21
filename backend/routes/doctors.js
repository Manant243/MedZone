const express = require('express')
const {
    postDoctor,
    getDoctors,
    singleDoctor
} = require('../controllers/doctorController.js')

const Doctor = require('../models/doctorModel')
const router = express.Router()

router.get('/', getDoctors)

router.get('/:id', singleDoctor)

router.post('/', postDoctor)

router.patch('/:id', (req, res) => {
    res.json({mssg : 'Update a doctor'})
})


module.exports = router
