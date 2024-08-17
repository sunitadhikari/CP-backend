const express = require('express');
const router = express.Router();
const Symptoms = require('../models/symptomsModel')
const verifyToken=require('../middleware');
const Signup = require('../models/userModel')

router.post('/postSymptoms', verifyToken, async (req, res) => {
    try {
        const { email }= req.user;
        const {  symptoms } = req.body;
        const symptom = new Symptoms({patient:email,symptoms});
        await symptom.save();
        res.status(201).json(symptom);
    }
    catch (err) {
        res.status(404).json({ message: err.message });
    }
});
router.get('/getSymptoms', verifyToken, async(req, res)=>{
    try{
        const symptom = await Symptoms.find();
        res.json(symptom);
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
})

router.get('/getsymptomsbypatient', verifyToken, async(req, res)=>{
    try{
        const {email}=req.user;
        const user= await Signup.findOne({email});
        if(!user){
            return res.status(404).send("User not found!");
        }
        const patient=await Symptoms.find({patient:email});
        if(!patient){
            return res.status(404).send("Patient not found!");
        }
        res.status(200).json({Symptoms:patient});
    }catch(error){
        return res.status(500).json({message:"Internal server erro!",error:error.message});
    }
})
router.delete('/deletesymptom/:id', verifyToken, async (req, res) => {
    try {
        const symptomId = req.params.id;

        // Check if the symptom exists
        const symptom = await Symptoms.findById(symptomId);
        if (!symptom) {
            return res.status(404).send("Symptom not found!");
        }

        // Delete the symptom
        await Symptoms.findByIdAndDelete(symptomId);
        res.status(200).json({ message: "Symptom deleted successfully!" });

    } catch (error) {
        res.status(500).json({ message: "Internal server error!", error: error.message });
    }
});


router.get('/getSymptomsbyEmail', verifyToken, async (req, res) =>{
    
    try{
       
        const { email } = req.user;
            
        const user = await Signup.findOne({ email });
        
        // If the user is not found, handle the error
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
   
        const symptom= await Symptoms.find({patient: email});
        
        if(symptom){
            
            const symptomByName = await Promise.all(symptom.map(async sy => {
                
                const sentto = await Signup.findOne({ email: sy.doctor });
                return {
                    ...sy._doc,
                    patient: user.firstName,
                    doctor: sentto.firstName
                };
            }));  
             res.json({ data: symptomByName });
        }
        else{
            res.status(404).json({message: "data not found"});
        }
    }
    catch(error)
    {
        res.status(500).json({ messgae: 'something is error', error });
    }
  })



  router.get('/getSymptomsbyDoctor', verifyToken, async (req, res) =>{
    
    try{
       
        const { email } = req.user;
            
        const user = await Signup.findOne({ email });
        
        // If the user is not found, handle the error
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
   
        const symptom= await Symptoms.find({doctor: email});
        
        if(symptom){
            
            const symptomByName = await Promise.all(symptom.map(async sy => {
                
                const sentto = await Signup.findOne({ email: sy.patient });
                return {
                    ...sy._doc,
                    doctor: user.firstName,
                    patient: sentto.firstName
                };
            }));  
             res.json({ data: symptomByName });
        }
        else{
            res.status(404).json({message: "data not found"});
        }
    }catch(error)
    {
        res.status(500).json({ messgae: 'something is error', error });
    }
  })


module.exports = router