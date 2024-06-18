const express = require('express');
const router = express.Router();
const schedule = require('../models/scheduleModel')

router.post('/postSchedule', async(req, res)=>{
    try{
       const schedules = new schedule(req.body);
       await schedules.save();
       res.status(201).json(schedules);
    }
    catch(err){
     res.status(400).json({message:err.message})
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

module.exports = router;