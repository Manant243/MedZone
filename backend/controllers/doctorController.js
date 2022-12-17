const mongoose = require('mongoose')
const Doctor = require('../models/doctorModel.js')
const Symptom = require('../models/symptomModel.js')


const getDoctors = async (req, res) => {
    const {Issues, location} = req.body

    const map = new Map();

    async function fun(data){
        const cur = await Symptom.findOne({Symptom : data})
        const vecs = cur.ids 

        vecs.forEach((vec) => {
            if(map.has(vec)){
                map.set(vec, map.get(vec)+1);
            }
            else{
                map.set(vec, 1);
            }
        })

    }

    Issues.forEach((Issue) => {
        fun(Issue)
    })

    const sortedmap = Array.from(map.keys()).sort((a, b) => {
        if(map.get(a) < map.get(b)){
            return -1;
        }
        else if(map.get(a) > map.get(b)){
            return 1;
        }
        else{
            return 0;
        }
    });

    const iterator = sortedmap.keys();
    let index = 0;
    const Obj = {}

    while(index < 10 && iterator.hasNext()) {
        const key = iterator.next();

        const value = sortedmap.get(key);
        const doc = Doctor.findOne({_id : key})

        const obj = {
            Name : doc.Name,
            Relief : doc.Relief,
            Address : doc.Address,
            Symptomps : doc.Symptomps,
            Matched : value,
            Distance : 0
        }

        Obj.push(obj)
        
        i++;
    }
    
    res.status(400).json(Obj)
}

const singleDoctor = async (req, res) => {
    res.json({mssg : 'Gave you a doctor'})
}

const postDoctor = async (req, res) => {
    const {Name, Relief, Address, Symptomps} = req.body
    const name = Name

    try{
        const doctor = await Doctor.create({Name, Relief, Address, Symptomps})
        res.status(201).json(doctor)

    } catch (error) {
        res.status(400).json({error : error.message})
    }

    const symps = Symptomps
    const result = await Doctor.findOne({ Name: name});
    const idString = result._id.toString();

    
    const arr = []
    arr.push(idString)

    async function run(data){
        const user = await Symptom.findOne({Symptom : data})
    
        if(!user){
            const symp = new Symptom({Symptom : data, ids : arr})
            await symp.save()
        }
        else{
            const update = { $push: { ids: idString}};
            Symptom.updateOne({ _id: mongoose.Types.ObjectId(user).toString() }, update, 
            function(err, doc) {
                if (err) {
                    console.log(err.message)
                } else {
                    console.log(user)
                }
            });
        }
    }

    symps.forEach((symp) => { 
        run(symp)
    })
}



module.exports = {
    postDoctor,
    getDoctors,
    singleDoctor
}

