const mongoose = require('mongoose')

const Schema = mongoose.Schema

const docSchema = new Schema({
    Name: {
        type: String,  
        required: true
    },
    Relief: {
        type: Number,
        required: true
    },
    Address: {
        type: String,
        required: true
    },
    Symptomps: {
        type: Array,
        required: true
    }
}, {timestamps: true})

module.exports = mongoose.model('Doctor', docSchema)

