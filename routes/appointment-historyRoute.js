const express = require('express');
const router = express.Router();
const appointment = require('../models/appointment-historyModel');

router.get('/getAppointmentHistory', async(req, res)=>{
 try{
const appointmentHistory = await appointment.find();
res.send(appointmentHistory)
 }
 catch(err){
    res.status(400).send(error);
 }
})
module.exports = router;