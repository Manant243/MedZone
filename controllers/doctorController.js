const mongoose = require('mongoose')
const Doctor = require('../models/doctorModel.js')
const Symptom = require('../models/symptomModel.js')
const {getDistancedata} = require('../distance.js')


const getDoctors = async (req, res) => {
    var Issues = req.query.array;
    const location = req.query.string;

    var arraytype = []
    var answer = ''

    if(typeof(Issues) == 'string'){
        for(let i = 0; i < Issues.length; i++){
            if(Issues[i] != ','){
                answer += Issues[i];
            }
            else{
                arraytype.push(answer);
                answer = '';
            }
        }
        arraytype.push(answer);
        Issues = arraytype
    }

    console.log(Issues);
    
    if(!Issues || Issues.length == 0){
        res.status(400).json({error: "Cannot access the issues array"})
    }
    else if(!location){
        res.status(400).json({error: "Cannot access location"})
    }
    else{
        const map = new Map();

        async function fun(data){
            var vecs
            try {
                const cur = await Symptom.findOne({Symptom : { $regex: data, $options: 'i' }}); 
                if(cur){
                    vecs = cur.ids;
                }
            } 
            catch(err) {
                console.log(err.message);
            }

            if(vecs){
                vecs.forEach((vec) => {
                    if(map.has(vec)){
                        map.set(vec, map.get(vec)+1);
                    }
                    else{
                        map.set(vec, 1);
                    }
                });
            }

        }

        const funPromises = Issues.map((Issue) => fun(Issue));
        await Promise.all(funPromises);
        

        const mapArray = Array.from(map.keys()).sort((a, b) => {
            if(map.get(a) < map.get(b)) {
                return 1;
            } 
            else if(map.get(a) > map.get(b)) {
                return -1;
            } 
            else{
                return 0;
            }
        });

        const entries = mapArray.map(key => [key, map.get(key)]);
        const sortedMap = new Map(entries);
        
        const size = sortedMap.size
        const iterator = sortedMap.keys();

        var Post = [];

        for(let index = 0; index < Math.min(size, 10); index++){

            const key = iterator.next();
            const value = sortedMap.get(key.value);

            try{
                const doc = await Doctor.findById(key.value)
                const doctorlocation = doc.Address
                
                var locationdata = await getDistancedata(doctorlocation, location);
                locationdata /= 1000;

                const object = {
                    DoctorName : doc.DoctorName,
                    UserName : doc.UserName,
                    Relief : doc.Relief,
                    Age : doc.Age,
                    Gender : doc.Gender,
                    Contact : doc.Contact || null,
                    Address : doc.Address,
                    Symptoms : doc.Symptoms,
                    Description : doc.Description || null,
                    Matched : value,
                    Distance : locationdata
                }

                Post.push(object);
            }
            catch (err){
                console.log(err.message);
            }
    
        }

        const Object = {Post}
        res.status(200).json(Object);

    }
    
}

const singleDoctor = async (req, res) => {
    res.json({mssg : 'Gave you a doctor'})
}

const postDoctor = async (req, res) => {
    console.log(req);

    const {DoctorName, UserName, Relief, Age, Gender, Contact, Address, Symptoms, Description} = req.body
    console.log(req.body);

    var itemId

    const exist = await Doctor.findOne({DoctorName : { $regex: DoctorName, $options: 'i' }, 
    UserName : { $regex: UserName, $options: 'i' }, 
    Symptoms: { $in: Symptoms.map(symptom => new RegExp(symptom, 'i')) }});
    

    if(exist){
        res.status(400).json({error : 'This post already exists'})
    }
    else{
        try{
            const doctor = new Doctor({DoctorName, UserName, Relief, Age, Gender, Contact, Address, Symptoms, Description})
            const wait = await doctor.save()
            itemId = wait._id
            res.status(201).json(doctor)
        }
        catch(error){
            res.status(400).json({error : error.message})
        }
    
        const symps = Symptoms
        const idString = itemId.toString();
    
        
        const arr = []
        arr.push(idString)
    
        async function run(data){
            const user = await Symptom.findOne({Symptom : { $regex: data, $options: 'i' }})
        
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
    
}

module.exports = {
    postDoctor,
    getDoctors,
    singleDoctor
}

