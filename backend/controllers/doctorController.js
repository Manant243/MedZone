const mongoose = require('mongoose')
const Doctor = require('../models/doctorModel.js')
const Symptom = require('../models/symptomModel.js')


const getDoctors = async (req, res) => {
    const {Issues, location} = req.body
    res.status(400).json()

    console.log(Issues)
    const map = new Map();

    async function fun(data){
        var vecs
        try {
            const cur = await Symptom.findOne({Symptom : data}); 
            vecs = cur.ids;
        } 
        catch(err) {
            console.log(err.message);
        }

        vecs.forEach((vec) => {
            if(map.has(vec)){
                map.set(vec, map.get(vec)+1);
            }
            else{
                map.set(vec, 1);
            }
        });

    }

    const funPromises = Issues.map((Issue) => fun(Issue));
    await Promise.all(funPromises);


    const mapArray = Array.from(map.keys()).sort((a, b) => {
        if (map.get(a) < map.get(b)) {
          return -1;
        } 
        else if (map.get(a) > map.get(b)) {
          return 1;
        } 
        else {
          return 0;
        }
    });

    const entries = mapArray.map(key => [key, map.get(key)]);
    const sortedMap = new Map(entries);
    
    const size = sortedMap.size
    console.log(size);
    console.log(sortedMap)

    const iterator = sortedMap.keys();
    const mainObject = {}

    for(let index = 0; index < Math.min(size, 10); index++){

        const key = iterator.next();
        const value = sortedMap.get(key.value);

        console.log(key);

        try{
            const doc = await Doctor.findById(key.value)
            const object = {
                Name : doc.Name,
                Relief : doc.Relief,
                Address : doc.Address,
                Symptomps : doc.Symptomps,
                Matched : value,
                Distance : 0
            }

            mainObject[`object${index}`] = object;
        }
        catch (err){
            console.log(err.message);
        }
  
    }

    console.log(mainObject);
    
}

const singleDoctor = async (req, res) => {
    res.json({mssg : 'Gave you a doctor'})
}

const postDoctor = async (req, res) => {
    const {Name, Relief, Address, Symptomps} = req.body
    const name = Name

    var itemId
    try{
        const doctor = new Doctor({Name, Relief, Address, Symptomps})
        const wait = await doctor.save()
        itemId = wait._id
        res.status(201).json(doctor)

    } catch (error) {
        res.status(400).json({error : error.message})
    }

    const symps = Symptomps
    const idString = itemId.toString();

    
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

