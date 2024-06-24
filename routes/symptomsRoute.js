const express = require('express');
const router = express.Router();
const symptoms = require('../models/symptomsModel')

router.post('/postSymptoms', async (req, res) => {
    try {
        const symptom = new symptoms(req.body);
        await symptom.save();
        res.status(201).json(symptom);
    }
    catch (err) {
        res.status(404).json({ message: err.message });
    }
});
router.get('/getSymptoms', async(req, res)=>{
    try{
        const symptom = await symptoms.find();
        res.json(symptom);
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
})

module.exports = router