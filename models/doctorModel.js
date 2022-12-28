const mongoose = require('mongoose')

const Schema = mongoose.Schema

const docSchema = new Schema({
    DoctorName: {
        type: String,  
        required: true
    },
    UserName: {
        type: String,
        required: true
    },
    Relief: {
        type: Number,
        required: true
    },
    Age: {
        type: Number,
        required: true
    },
    Gender: {
        type: String,
        required: true
    },
    Contact: {
        type: String
    },
    Address: {
        type: String,
        required: true
    },
    Symptoms: {
        type: Array,
        required: true
    },
    Description: {
        type: String,
    }
}, {timestamps: true})

module.exports = mongoose.model('Doctor', docSchema)

