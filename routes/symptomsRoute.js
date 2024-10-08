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
        const symptoms = await Symptoms.find();

        const symptomDetails = await Promise.all(symptoms.map(async (symptom) => {
            const patient = await Signup.findOne({ email: symptom.patient });
            const doctor = await Signup.findOne({ email: symptom.doctor });

            return {
                ...symptom._doc,
                patient: patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient',
                doctor: doctor ? `${doctor.firstName} ${doctor.lastName}` : 'Not Assigned'
            };
        }));

        res.json(symptomDetails);
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


router.get('/getSymptomsbyEmail', verifyToken, async (req, res) => {
    try {
        const { email } = req.user;

        const user = await Signup.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const symptoms = await Symptoms.find({ patient: email });

        if (symptoms.length > 0) {
            const symptomByName = await Promise.all(symptoms.map(async (sy) => {
                const sentto = await Signup.findOne({ email: sy.doctor });
                return {
                    ...sy._doc,
                    patient: user.firstName + " " + user.lastName,
                    doctor: sentto ? sentto.firstName + " " + sentto.lastName : 'Not assigned'
                };
            }));
            res.json({ data: symptomByName });
        } else {
            res.status(404).json({ message: "No symptoms found for this user" });
        }
    } catch (error) {
        console.error('Error fetching symptoms:', error);
        res.status(500).json({ message: 'Internal server error', error: error.toString() });
    }
});



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
// In your Express backend

router.get('/getTotalSymptomsCount', verifyToken, async (req, res) => {
    try {
      const { email } = req.user;
  
      // Find the user based on email
      const user = await Signup.findOne({ email });
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
     
      // Count the number of symptoms associated with the doctor
      const symptomCount = await Symptoms.countDocuments({ doctor: email });
      
      res.json({
        message: 'Total number of symptoms for this doctor:',
        count: symptomCount
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  });
  
  //for reception
router.put('/assignDoctor/:id',verifyToken,async(req,res)=>{
    try{
        const { email } =req.user;
    const user = await Signup.findOne({email});
    if(!user){
        return res.status(404).send("User not found!");
    }
    const { doctor}=req.body;
    const assign = await Symptoms.findByIdAndUpdate(req.params.id,{doctor},{new:true});
    if(!assign){
        return res.status(404).send("Symptoms not found!");
    }
    res.status(200).json({message:"Doctor successfully assigned to this patient!",assign});
    }catch(error){
        return res.status(500).send({message:"Something is wrong!",error:error.message});
    }
});


  //for reception
  router.put('/updatesymptoms/:id',verifyToken,async(req,res)=>{
    try{
        const { email } =req.user;
    const user = await Signup.findOne({email});
    if(!user){
        return res.status(404).send("User not found!");
    }
    const { symptoms}=req.body;
    const assign = await Symptoms.findByIdAndUpdate(req.params.id,{symptoms},{new:true});
    if(!assign){
        return res.status(404).send("Symptoms not found!");
    }
    res.status(200).json({message:"Symptoms updated successfully!",assign});
    }catch(error){
        return res.status(500).send({message:"Something is wrong!",error:error.message});
    }
});

  // Delete Symptoms
  router.delete('/delsymptoms/:id', verifyToken, async (req, res) => {
    try {
      const { id } = req.params;
      const deletedsymptoms = await Symptoms.findByIdAndDelete(id);
  
      if (!deletedsymptoms) {
        return res.status(404).json({ message: 'Symptoms not found' });
      }
      return res.status(200).json({ message: 'Symptoms deleted successfully' });
    } catch (error) {
      return res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
  });
module.exports = router