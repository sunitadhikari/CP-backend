const express = require('express');
const router = express.Router();
const schedule = require('../models/scheduleModel');
const verifyToken = require('../middleware');
const Signup = require('../models/userModel');


// router.post('/postSchedule', async (req, res) => {
//   try {
//     const { doctorName, availableDays } = req.body;

//     // Check if a schedule already exists for the same doctor with the same availableDays
//     const existingSchedule = await schedule.findOne({ doctorName, availableDays });

//     if (existingSchedule) {
//       return res.status(400).json({ message: 'Schedule already exists for this doctor on the specified day.' });
//     }

//     // If no such schedule exists, proceed to save the new schedule
//     const newSchedule = new schedule(req.body);
//     await newSchedule.save();

//     res.status(201).json(newSchedule);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });
// router.post('/postSchedule', async (req, res) => {
//   try {
//     const { doctorName, availableDays, date, startTime, endTime } = req.body;

//     // Format the date to yyyy-mm-dd (remove time portion)
//     const formattedDate = new Date(date).toISOString().split('T')[0];

//     const existingSchedule = await schedule.findOne({ doctorName, availableDays, date: formattedDate });

//     if (existingSchedule) {
//       return res.status(400).json({ message: 'Schedule already exists for this doctor on the specified day.' });
//     }

//     // Create and save the new schedule
//     const newSchedule = new schedule({
//       doctorName,
//       availableDays,
//       date: formattedDate,  // Save formatted date as string
//       startTime,
//       endTime
//     });

//     await newSchedule.save();
//     res.status(201).json(newSchedule);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

router.post('/postSchedule', async (req, res) => {
  try {
    const { doctorName, date, startTime, endTime } = req.body;

    // Check if the schedule already exists for the same doctor on the same date
    const existingSchedule = await schedule.findOne({
      doctorName,
      date
    });

    if (existingSchedule) {
      return res.status(400).json({ message: 'Schedule already exists for this doctor on the specified day.' });
    }

    // Create and save the new schedule
    const newSchedule = new schedule({
      doctorName,
      date,  // Save date in "YYYY-MM-DD" format
      startTime,
      endTime
    });

    await newSchedule.save();
    res.status(201).json(newSchedule);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// router.post('/postSchedule', async (req, res) => {
//   try {
//     const { doctorName, availableDays, date, startTime, endTime } = req.body;

//     // Check if a schedule already exists for the specified doctor on the specified day
//     const existingSchedule = await schedule.findOne({
//       doctorName: doctorName,
//       availableDays: availableDays,
//       date: date
//     });

//     if (existingSchedule) {
//       return res.status(400).json({ message: 'Schedule already exists for this doctor on the specified day.' });
//     }

//     // If no such schedule exists, proceed to save the new schedule
//     const newSchedule = new schedule(req.body);
//     await newSchedule.save();

//     res.status(201).json(newSchedule);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// router.get('/getSchedule', async (req, res) => {
//   try {
//     const schedul = await schedule.find();
//     res.json(schedul);
//   }
//   catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// })


router.get('/getSchedule', async (req, res) => {
  try {
    const schedules = await schedule.find();
    if(!schedules || schedules.length=== 0){
      return res.status(404).send("Schedule not found");
    }
    const schedul = await Promise.all(schedules.map(async sc => {
      const doctor=await Signup.findOne({email:sc.doctorName});
              return {
                  ...sc._doc,
                  doctorName: doctor.firstName + " " + doctor.lastName
              }
          }
      ));  
    
    res.json(schedul);
  }
  catch (err) {
    res.status(500).json({ message: err.message });
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

    const schedules = await schedule.find({ doctorName: user.email });

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
    const scheduleWithDoctorInfo = await schedule.aggregate([
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


router.put('/updateschedule/:id', verifyToken, async (req, res) => {
  try {
    const { doctorName, availableDays, startTime, endTime, mobileNumber, sex } = req.body;

    const schedul = await schedule.findByIdAndUpdate(req.params.id, { doctorName, availableDays, startTime, endTime, mobileNumber, sex }, { new: true });
    if (!schedul) {
      return res.status(404).send({ message: "Schedule not found" });
    }
    res.send({ message: "schedule updated successfully", schedul });
  } catch (error) {
    res.status(500).send(error);
  }
});


router.delete('/delschedule/:id', verifyToken, async (req, res) => {
  try {
    const schedul = await schedule.findByIdAndDelete(req.params.id);
    if (!schedul) {
      return res.status(404).send({ message: "Schedule not found" });
    }
    res.send({ message: "schedule Deleted successfully", schedul });
  } catch (error) {
    res.status(500).send(error);
  }
});


module.exports = router;