const express = require('express');
const router = express.Router();
const doctorNote = require('../models/doctornoteModel');
const verifyToken=require('../middleware');
const Signup= require('../models/userModel')

router.post('/addDoctornote',verifyToken, async (req, res) => {
    try {
        const { email } = req.user;
        const { patient, date, content }= req.body;
        const note = new doctorNote({
        patient,
        doctor: email,
        date,
        content
      });
      await note.save();
      res.status(200).send({message:"Doctor note added successfully!!",note});
    }
    catch (error) {
      res.status(500).send({message:"Something error occurred!",error:error.message});
    }
  });
  
  router.get('/getDoctornote',verifyToken, async (req, res) => {
    try {
      const note = await doctorNote.find();
      if(!note){
        res.send("Data not found.");
      }
      res.send({message:"Doctor note fetched!",DoctorNotes: note});
    } catch (error) {
        res.status(500).send({message:"Something error occurred!",error:error.message});
    }
  });

  //to get doctornote on doctor's profile
router.get('/getDoctornotebyEmail', verifyToken, async (req, res) =>{
    
    try{
       
        const { email } = req.user;
            
        const user = await Signup.findOne({ email });
        
        // If the user is not found, handle the error
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
   
        const note= await doctorNote.find({doctor: email});
        
        if(note){
            
            const noteByName = await Promise.all(note.map(async nt => {
                
                const sentto = await Signup.findOne({ email: nt.patient });
                return {
                    ...nt._doc,
                    doctor: user.firstName,
                    patient: sentto.firstName
                };
            }));  
             res.status(200).json({ message:"Doctor notes to doctor themself:",data: noteByName });
        }
        else{
            res.status(404).json({message: "data not found"});
        }
    }catch(error)
    {
        res.status(500).json({ messgae: 'something is error', error });
    }
  })


  //to get doctornote on patient's profile
  router.get('/getDoctornotebyDoctor', verifyToken, async (req, res) =>{
    
    try{
       
        const { email } = req.user;
            
        const user = await Signup.findOne({ email });
        
        // If the user is not found, handle the error
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
   
        const note= await doctorNote.find({patient: email});
        
        if(note){
            
            const noteByName = await Promise.all(note.map(async nt => {
                
                const sentby = await Signup.findOne({ email: nt.doctor });
                return {
                    ...nt._doc,
                    patient: user.firstName,
                    doctor: sentby.firstName
                };
            }));  
             res.status(200).json({ message:"Doctor notes to patients:",data: noteByName });
        }
        else{
            res.status(404).json({message: "data not found"});
        }
    }catch(error)
    {
        res.status(500).json({ messgae: 'something is error', error:error.message });
    }
  })

  module.exports = router;