const express = require('express');
const router = express.Router();
const Prescription = require('../models/appPrescription.model');
const Appointment = require('../models/appointmentModel');
const verifyToken = require('../middleware');

// Create a new prescription
router.post('/prescription', async (req, res) => {
  try {
    const prescription = new Prescription(req.body);
    await prescription.save();
    res.status(201).json(prescription);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
router.get('/pres', async (req, res) => {
  try {
    const prescriptions = await Prescription.find();
    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
})
//thik xa 
router.get('/prescriptions', verifyToken, async (req, res) => {
  try {
    const {email} = req.user; 
    const appointments = await Appointment.find({ email: email }).select('_id');
    
    const appointmentIds = appointments.map(appointment => appointment._id);

    const prescriptions = await Prescription.find({ appointmentId: { $in: appointmentIds } });
    
    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



router.get('/prescriptions/:appointmentId', async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ appointmentId: req.params.appointmentId });
    res.json(prescriptions);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
router.get('/prescription/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const prescription = await Prescription.findById(id);

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    res.status(200).json(prescription);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.put('/prescription/:id', async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(prescription);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/prescription/:id', async (req, res) => {
  try {
    await Prescription.findByIdAndDelete(req.params.id);
    res.json({ message: 'Prescription deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/opdreport',verifyToken, async(req,res)=>{
  try{
    const {email}=req.user;
    // const user=await Signup.findOne({email});
    // if(!user){
    //   return res.status(404).send("User not found!");
    // }
    const appointments = await Appointment.find({ email: email });
    
    const appointmentIds = appointments.map(appointment => appointment._id);

    const prescriptions = await Prescription.find({ appointmentId: { $in: appointmentIds } });
    
    const data = appointments.map(appointment => {
      const appointmentPrescriptions = prescriptions.filter(prescription => 
        prescription.appointmentId.toString() === appointment._id.toString());
      return {
        ...appointment.toObject(),
        prescriptions: appointmentPrescriptions
      };
    });
    res.json(data);

  }catch(error){
    return res.status(500).json({message:"Internal Server Error!",error:error.message})
  }
});

router.get('/opdreportinDoctor',verifyToken, async(req,res)=>{
  try{
    const {email}=req.user;
    // const user=await Signup.findOne({email});
    // if(!user){
    //   return res.status(404).send("User not found!");
    // }
    const appointments = await Appointment.find( {doctorname:email} );
    
    const appointmentIds = appointments.map(appointment => appointment._id);

    const prescriptions = await Prescription.find({ appointmentId: { $in: appointmentIds } });
    
    const data = appointments.map(appointment => {
      const appointmentPrescriptions = prescriptions.filter(prescription => 
        prescription.appointmentId.toString() === appointment._id.toString());
      return {
        ...appointment.toObject(),
        prescriptions: appointmentPrescriptions
      };
    });
    res.json(data);

  }catch(error){
    return res.status(500).json({message:"Internal Server Error!",error:error.message})
  }
});

module.exports = router;
