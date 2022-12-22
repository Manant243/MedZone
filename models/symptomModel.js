const mongoose = require('mongoose')

const Schema = mongoose.Schema

const symSchema = new Schema({
    Symptom : {
        type: String,
        required: true
    },
    ids : [{type : String}]

}, {timestamps: true})

module.exports = mongoose.model('Symptom', symSchema)

