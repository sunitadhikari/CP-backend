const express = require('express');
const router = express.Router();
const appointments = require('../models/appointmentModel');
const Signup= require('../models/userModel');
const verifyToken = require('../middleware');
const Prescription = require('../models/appPrescription.model');
const Schedule = require('../models/scheduleModel');

// router.post('/postAppointment', verifyToken, async (req, res) => {
//     const email = req.user.email;
//     const username = req.user.username;
//     const {departmentName, doctorname, date, time, phone, problem } = req.body;
    
//     const appointment = new appointments({
//         username,
//         email,
//         departmentName,
//         doctorname,
//         date,
//         // time,
//         phone,
//         problem,
//         isPaid: false
//       });
    
//       try {
//         const newAppointment = await appointment.save();
//         res.status(201).json(newAppointment);
//       } catch (err) {
//         res.status(400).json({ message: err.message });
//       }
//     });
router.post('/postAppointment', verifyToken, async (req, res) => {
  const email = req.user.email;
  const username = req.user.username;
  const { departmentName, doctorname, date, phone, problem } = req.body;

  try {
      // Check if an appointment already exists with the same doctor and date for the user
      const existingAppointment = await appointments.findOne({
          username: username,
          doctorname: doctorname,
          date: date
      });

      if (existingAppointment) {
          return res.status(400).json({ message: 'You have already booked an appointment with this doctor on this date.' });
      }

      // If no existing appointment, create a new one
      const appointment = new appointments({
          username,
          email,
          departmentName,
          doctorname,
          date,
          phone,
          problem,
          isPaid: false
      });

      const newAppointment = await appointment.save();
      res.status(201).json(newAppointment);
  } catch (err) {
      res.status(400).json({ message: err.message });
  }
});
router.put('/updateAppointment/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { departmentName, doctorname, date, phone, problem } = req.body;

  try {
    const updatedAppointment = await appointments.findByIdAndUpdate(
      id,
      { departmentName, doctorname, date, phone, problem },
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json(updatedAppointment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

    router.get('/paidAppointments', verifyToken, async (req, res) => {
      try {
        const paidAppointments = await appointments.find({ isPaid: true });
        res.status(200).json(paidAppointments);
      } catch (error) {
        console.error('Error fetching paid appointments:', error); 
        res.status(500).json({ message: 'Error fetching paid appointments', error });
      }
    });
    router.get('/appointments', async (req, res) => {
      try {
        const appointmentList = await appointments.find();
        res.send(appointmentList);
      } catch (error) {
        res.status(400).send(error);
      }
    });
// router.get('/appointmentsByEmail', verifyToken, async (req, res) => {
//     try {
//         const email = req.user.email; // Ensure the token contains the email

//         const userAppointments = await appointments.find({ email });

//         if (userAppointments.length<0 && userAppointments.length==0) { 
//             return res.status(404).json({ message: 'No appointments found for this user' });
//         }
//         const appointmentByName = await Promise.all(userAppointments.map(async appoint => {
//           const doctor = await Signup.findOne({email: appoint.doctorname });
//           return {
//               ...appoint._doc,
//               doctorname: doctor.firstName + " " + doctor.lastName
              
//           };
 
//       }));  
//         res.json({ appointmentByName });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });

router.get('/appointmentsByEmail', verifyToken, async (req, res) => {
  try {
      const email = req.user.email; // Ensure the token contains the email

      const userAppointments = await appointments.find({ email });

      if (!userAppointments || userAppointments.length === 0) { 
          return res.status(404).json({ message: 'No appointments found for this user' });
      }

      const appointmentByName = await Promise.all(userAppointments.map(async (appoint) => {
        const doctor = await Signup.findOne({ email: appoint.doctorname });

        if (!doctor) {
          // Handle case where doctor is not found
          return {
            ...appoint._doc,
            doctorname: 'Unknown Doctor',
            doctorSchedule: null
          };
        }

        const schedule = await Schedule.findOne({ doctorName: appoint.doctorname });
        return {
          ...appoint._doc,
          doctorname: doctor.firstName + " " + doctor.lastName,
          doctorSchedule: schedule || 'No schedule available' // Handle case where schedule is not found
        };
      }));

      res.json({ appointmentByName });
  } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

// router.get('/appointmentsByEmail', verifyToken, async (req, res) => {
//   try {
//       const email = req.user.email; // Ensure the token contains the email

//       const userAppointments = await appointments.find({ email });

//       if (userAppointments.length<0 && userAppointments.length==0) { 
//           return res.status(404).json({ message: 'No appointments found for this user' });
//       }
//       const appointmentByName = await Promise.all(userAppointments.map(async appoint => {
//         const doctor = await Signup.findOne({email: appoint.doctorname });
//         const schedule = await Schedule.findOne({doctorName:appoint.doctorname})
//         return {
//             ...appoint._doc,
//             doctorname: doctor.firstName + " " + doctor.lastName,
//             doctorSchedule: schedule
//         };

//     }));  
//       res.json({ appointmentByName });
//   } catch (error) {
//       console.log(error);
//       res.status(500).json({ message: 'Internal server error' });
//   }
// });


router.post('/updatePaymentStatus', verifyToken, async (req, res) => {
  const { id, payload } = req.body;

  try {
    const appointment = await appointments.findById(id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.isPaid = true;
    appointment.paymentDetails = payload; // Optionally save payment details

    const updatedAppointment = await appointment.save();
    res.status(200).json(updatedAppointment);
  } catch (error) {
    console.error('Error updating payment status:', error); // Log the full error
    res.status(500).json({ message: 'Error updating payment status', error });
  }
});

router.get('/appointment', verifyToken, async (req, res) => {
    try {
        const doctorEmail = req.user.email; // Assuming doctor's email is in req.user.email
        const appointment = await appointments.find({ email: doctorEmail });
        res.json(appointment);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching appointments', error });
    }
});
// router.get('/docAppointmentsEmail', verifyToken, async (req, res) => {
//   try {
//     const doctorEmail = req.user.email; 
//     const user = await Signup.findOne({ email: doctorEmail });
//     if (!user) {
//       return res.status(404).json({ message: 'Doctor not found' });
//     }

//     const appointmentList = await appointments.find({ doctorname: doctorEmail });
//     res.json(appointmentList);
//   } catch (error) {
//     console.error('Error fetching appointments:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });


// router.get('/docAppointmentsEmail', verifyToken, async (req, res) => {
//     try {
//       const doctorEmail = req.user.email; 
//       const user = await Signup.findOne({ email: doctorEmail });
//       if (!user) {
//         return res.status(404).json({ message: 'User not found' });
//       }
  
//       const appointmentList = await appointments.find({ doctorname: doctorEmail });
//       if(!appointmentList || appointmentList.length==0){
//           return res.status(404).send('No appointments for this doctor');
//       }
//       const appointmentwithName = await Promise.all(appointmentList.map(async appoint => {
              
//           const sentto = await Signup.findOne({ email: appoint.email });
//           return {
//               ...appoint._doc,
//               doctorname: user.firstName + " " + user.lastName,
//               username: sentto.firstName + " " + sentto.lastName
//           };
//       }));  
//       res.status(200).json({message:'Appointment for doctor',appointmentwithName});
//     } catch (error) {
//       console.error('Error fetching appointments:', error);
//       res.status(500).json({ message: 'Internal server error' });
//     }
//   });



// router.get('/docAppointmentsEmail', verifyToken, async (req, res) => {
//   try {
//     const doctorEmail = req.user.email; 
//     const user = await Signup.findOne({ email: doctorEmail });
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Find appointments where the doctorname is doctorEmail and isPaid is true
//     const appointmentList = await appointments.find({ doctorname: doctorEmail, isPaid: true });
//     if (!appointmentList || appointmentList.length === 0) {
//       return res.status(404).send('No appointments for this doctor');
//     }

//     const appointmentwithName = await Promise.all(appointmentList.map(async appoint => {
//       const sentto = await Signup.findOne({ email: appoint.email });
//       return {
//         ...appoint._doc,
//         doctorname: user.firstName + " " + user.lastName,
//         username: sentto.firstName + " " + sentto.lastName
//       };
//     }));

//     res.status(200).json({ message: 'Appointment for doctor', appointmentwithName });
//   } catch (error) {
//     console.error('Error fetching appointments:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

router.get('/docAppointmentsEmail', verifyToken, async (req, res) => {
  try {
    const doctorEmail = req.user.email; 
    const user = await Signup.findOne({ email: doctorEmail });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find appointments where the doctorname is doctorEmail and isPaid is true
    const appointmentList = await appointments.find({ doctorname: doctorEmail, isPaid: true });
    if (!appointmentList || appointmentList.length === 0) {
      return res.status(404).send('No appointments for this doctor');
    }
    const appointmentIds = appointmentList.map(appointment => appointment._id);

    const prescriptions = await Prescription.find({ appointmentId: { $in: appointmentIds } });
    
    const appointmentwithName = appointmentList.map(appointment => {
      const appointmentPrescriptions = prescriptions.filter(prescription => 
        prescription.appointmentId.toString() === appointment._id.toString());
      return {
        ...appointment.toObject(),
        prescriptions: appointmentPrescriptions
      };
    });

    res.status(200).json({ message: 'Appointment for doctor', appointmentwithName });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

  
  router.get('/appointmentsByPatient', verifyToken, async(req,res) =>{
      try{
          const {email}=req.user;
          const user=await Signup.findOne({email});
          if(!user){
              return res.status(404).send('User not found');
          }
          const patient = await appointments.find({email:user.email});
          if(![patient] || patient.length==0){
              return res.status(404).send('Patient not found in appointment');
          }
          const patientwithName = await Promise.all(patient.map(async appoint => {
                  
              const sentto = await Signup.findOne({ email: appoint.doctorname });
              return {
                  ...appoint._doc,
                  username: user.firstName + " " + user.lastName,
                  doctorname: sentto.firstName + " " + sentto.lastName
              };
          }));  
          return res.status(200).json({message:'Appointment for patient',patientwithName});
           //res.status(200).json({message:'Appointment for teacher',teacher:teacher, count:teacher.length});
      }catch(error){
          return res.status(500).send({message:"Internal server error!", error:error.message});
      }
  });

  router.put('/updateAppointment/:id',verifyToken, async (req, res) => {
    try {
        const {departmentName, doctorname, date, time, phone, problem } = req.body;

      const appointment = await appointments.findByIdAndUpdate(req.params.id, { departmentName, doctorname, date, time, phone, problem }, { new: true });
      if (!appointment) {
        return res.status(404).send({message:"Appointment not found"});
      }
      res.send({message:"Appointment updated successfully",appointment});
    } catch (error) {
      res.status(500).send(error);
    }
  });


  router.delete('/delAppointment/:id',verifyToken, async (req, res) => {
    try {
      const appointment = await appointments.findByIdAndDelete(req.params.id);
      if (!appointment) {
        return res.status(404).send({message:"Appointment not found"});
      }
      res.send({message:"Appointment Deleted successfully",appointment});
    } catch (error) {
      res.status(500).send(error);
    }
  });

router.delete('/delAppointment/:id', verifyToken, async(req,res)=>{
  try{
    const appointment = await appointments.findById(req.params.id);
    if(!appointment){
      return res.status(404).send();
    }
    res.status(appointment);
  }
  catch(error){
    res.status(500).send(error);
  }
})


module.exports = router;