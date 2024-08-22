const express = require('express');
const router = express.Router();
const Schedule = require('../models/scheduleModel');
const verifyToken=require('../middleware');
const Signup=require('../models/userModel');

// router.post('/postSchedule', async(req, res)=>{
//     try{
//        const schedules = new schedule(req.body);
//        await schedules.save();
//        res.status(201).json(schedules);
//     }
//     catch(err){
//      res.status(500).json({message:err.message})
//     }
// })
router.post('/postSchedule', async (req, res) => {
  try {
    const { doctorName, availableDays } = req.body;

    // Check if a schedule already exists for the same doctor with the same availableDays
    const existingSchedule = await Schedule.findOne({ doctorName, availableDays });

    if (existingSchedule) {
      return res.status(400).json({ message: 'Schedule already exists for this doctor on the specified day.' });
    }

    // If no such schedule exists, proceed to save the new schedule
    const newSchedule = new Schedule(req.body);
    await newSchedule.save();

    res.status(201).json(newSchedule);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/getSchedule', async(req, res)=>{
    try{
        const schedule = await Schedule.find();
        const schedul = await Promise.all(schedule.map(async scdl => {
                  
          const doctorname = await Signup.findOne({ email: scdl.doctorName });
          return {
              ...scdl._doc,
              doctorName: doctorname.firstName + " " + doctorname.lastName
          };
      }));  
        res.json(schedul);
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
})


  //to get doctorschedule on doctor's profile
  router.get('/getschedulebyDoctor', verifyToken, async (req, res) => {
    try {
        const { email } = req.user;
        
        const user = await Signup.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const schedules = await Schedule.find({ doctorName: user.email});
        
        if (schedules && schedules.length > 0) {
            res.status(200).json({ message: "Doctor schedule for doctor:", data: schedules });
        } else {
            res.status(404).json({ message: "No schedule found for this doctor" });
        }
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
});
//

  
  //to get doctor schedule on patient's profile
  // router.get('/getschedulebyPatient', verifyToken, async (req, res) =>{
    
  //   try{
  //       const schedul= await schedule.find();
  //       if(schedul.length>0){
            
  //           const scheduleByName = await Promise.all(schedul.map(async sc => {
  //               const [firstName, lastName] = sc.doctorName.split(' ');
  //               const doctor = await Signup.findOne({ firstName, lastName });
  //               return {
  //                   ...sc._doc,
  //                   doctorName: doctor.firstName + " " + doctor.lastName
  //               };
       
  //           }));  
  //           res.status(200).json({ message:"Doctor schedules to patients:",data: scheduleByName });
  //       }
        
  //   }catch(error)
  //   {
  //       res.status(500).json({ message: 'something is error', error:error.message });
  //   }
  // });

  router.get('/getschedulebyPatient', verifyToken, async (req, res) => {
    try {
        // Lookup schedule and join with Signup collection
        const scheduleWithDoctorInfo = await Schedule.aggregate([
            {
                $lookup: {
                    from: 'schedule', // The collection name in MongoDB
                    localField: 'doctorName',
                    foreignField: 'firstName', // Ensure this is correct, might need tweaking
                    as: 'doctorInfo'
                }
            },
            {
                $unwind: {
                    path: '$doctorInfo',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    doctorName: { $concat: ['$doctorInfo.firstName', ' ', '$doctorInfo.lastName'] },
                    availableDays: 1,
                    startTime: 1,
                    endTime: 1,
                    mobileNumber: 1,
                    sex: 1
                }
            }
        ]);

        if (scheduleWithDoctorInfo.length > 0) {
            res.status(200).json({ message: "Doctor schedules to patients:", data: scheduleWithDoctorInfo });
        } else {
            res.status(404).json({ message: "No schedules found" });
        }
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
});


  router.put('/updateschedule/:id',verifyToken, async (req, res) => {
    try {
        const { doctorName, availableDays, startTime, endTime, mobileNumber, sex  }=req.body;

      const schedul = await Schedule.findByIdAndUpdate(req.params.id, { doctorName, availableDays, startTime, endTime, mobileNumber, sex }, { new: true });
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
      const schedul = await Schedule.findByIdAndDelete(req.params.id);
      if (!schedul) {
        return res.status(404).send({message:"Schedule not found"});
      }
      res.send({message:"schedule Deleted successfully",schedul});
    } catch (error) {
      res.status(500).send(error);
    }
  });


module.exports = router;