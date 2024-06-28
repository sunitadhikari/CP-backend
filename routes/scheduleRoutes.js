const express = require('express');
const router = express.Router();
const schedule = require('../models/scheduleModel');
const verifyToken=require('../middleware');
const Signup=require('../models/userModel');

router.post('/postSchedule', async(req, res)=>{
    try{
       const schedules = new schedule(req.body);
       await schedules.save();
       res.status(201).json(schedules);
    }
    catch(err){
     res.status(500).json({message:err.message})
    }
})
router.get('/getSchedule', async(req, res)=>{
    try{
        const schedul = await schedule.find();
        res.json(schedul);
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
})


  //to get doctorschedule on doctor's profile
  router.get('/getschedulebyDoctor', verifyToken, async (req, res) =>{
    
    try{
       
        const { email } = req.user;
            
        const user = await Signup.findOne({ email });
        
        // If the user is not found, handle the error
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
   
        const schedul= await schedule.find({doctorName: user.name});
        
        if(schedul){
             res.status(200).json({ message:"Doctor schedule to doctors:",data: schedul });
        }
        else{
            res.status(404).json({message: "data not found"});
        }
    }catch(error)
    {
        res.status(500).json({ messgae: 'something is error', error:error.message });
    }
  });



  
  //to get doctor schedule on patient's profile
  router.get('/getschedulebyPatient', verifyToken, async (req, res) =>{
    
    try{
        const schedul= await schedule.find();
        if(schedul.length>0){
            
            const scheduleByName = await Promise.all(schedul.map(async sc => {
                const [firstName, lastName] = sc.doctorName.split(' ');
                const doctor = await Signup.findOne({ firstName, lastName });
                return {
                    ...sc._doc,
                    doctorName: doctor.firstName + " " + doctor.lastName
                };
       
            }));  
            res.status(200).json({ message:"Doctor schedules to patients:",data: scheduleByName });
        }
        
    }catch(error)
    {
        res.status(500).json({ message: 'something is error', error:error.message });
    }
  });



  router.put('/updateschedule/:id',verifyToken, async (req, res) => {
    try {
        const { doctorName, availableDays, startTime, endTime, mobileNumber, sex  }=req.body;

      const schedul = await schedule.findByIdAndUpdate(req.params.id, { doctorName, availableDays, startTime, endTime, mobileNumber, sex });
      if (!schedul) {
        return res.status(404).send({message:"Schedule not found"});
      }
      res.send({message:"schedule updated successfully",schedul});
    } catch (error) {
      res.status(500).send(error);
    }
  });


  router.delete('/delschedule/:id',verifyToken, async (req, res) => {
    try {
      const schedul = await schedule.findByIdAndDelete(req.params.id);
      if (!schedul) {
        return res.status(404).send({message:"Schedule not found"});
      }
      res.send({message:"schedule Deleted successfully",schedul});
    } catch (error) {
      res.status(500).send(error);
    }
  });


module.exports = router;