const express = require('express')
const router = express.Router()
const doctor = require('../models/doctorModel');

router.post('/doctorRegister', async (req, res) => {
    try{
    const newDoctor = new doctor({
        doctorName: req.body.doctorName,
        specialist: req.body.speccialist,
        day: req.body.day,
        time: req.body.time,
        username: req.body.username,
        email: req.body.email,
        descrition: req.body.description,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
    })
    const passwordCheck = newDoctor.password == newDoctor.confirmPassword
    if (!passwordCheck) {
        return res.json({ message: 'Password doesnot match' })
    }
    await newDoctor.save();
    res.json({ message: 'Doctor password match' })
}
catch(error){
    console.log(error);
}
})
router.get('/getDoctorRegister', (req, res) => {
    doctor.find()
    .then(data => res.send(data))
    .catch(err => console.log(err))
})
router.post('/postDoctorLogin', async(req, res) =>{
    const{username, password}=req.body;
    const findDoctor = await user.findOne({username});
    if(!findDoctor){
        console.log(error);
        return res.json({message:'username not found'})
    }
    const isPasswordMatch = password == findDoctor.password
    if(!isPasswordMatch){
        console.log('Password is incorrect');
     return res.json({message:'Incorrect password'})
    }
    res.json({message:'Login successully'})
})
module.exports = router