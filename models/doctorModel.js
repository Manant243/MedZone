const mongoose = require('mongoose')

const Schema = mongoose.Schema

const docSchema = new Schema({
    Name1: {
        type: String,  
        required: true
    },
    Name2: {
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
    Address: {
        type: String,
        required: true
    },
    Symptomps: {
        type: Array,
        required: true
    },
    Description: {
        type: String,
        required: true
    }
}, {timestamps: true})

module.exports = mongoose.model('Doctor', docSchema)
