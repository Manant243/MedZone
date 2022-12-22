const mongoose = require('mongoose')
const Doctor = require('../models/doctorModel.js')
const Symptom = require('../models/symptomModel.js')
const {getDistancedata} = require('../distance.js')


const getDoctors = async (req, res) => {
    const {Issues, location} = req.body

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
          return 1;
        } 
        else if (map.get(a) > map.get(b)) {
          return -1;
        } 
        else {
          return 0;
        }
    });

    const entries = mapArray.map(key => [key, map.get(key)]);
    const sortedMap = new Map(entries);
    
    const size = sortedMap.size

    const iterator = sortedMap.keys();
    const mainObject = {}

    for(let index = 0; index < Math.min(size, 10); index++){

        const key = iterator.next();
        const value = sortedMap.get(key.value);

        try{
            const doc = await Doctor.findById(key.value)
            const doctorlocation = doc.Address
            
            var locationdata = await getDistancedata(doctorlocation, location);
            locationdata /= 1000;

            const object = {
                Name1 : doc.Name1,
                Name2 : doc.Name2,
                Relief : doc.Relief,
                Age : doc.Age,
                Gender : doc.Gender,
                Address : doc.Address,
                Symptomps : doc.Symptomps,
                Description : doc.Description,
                Matched : value,
                Distance : locationdata
            }

            mainObject[`object${index}`] = object;
        }
        catch (err){
            console.log(err.message);
        }
  
    }

    res.status(400).json(mainObject);
    
}

const singleDoctor = async (req, res) => {
    res.json({mssg : 'Gave you a doctor'})
}

const postDoctor = async (req, res) => {
    const {Name1, Name2, Relief, Age, Gender, Address, Symptomps, Description} = req.body

    var itemId

    try{
        const doctor = new Doctor({Name1, Name2, Relief, Age, Gender, Address, Symptomps, Description})
        const wait = await doctor.save()
        itemId = wait._id
        res.status(201).json(doctor)

    } 
    catch (error) {
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

