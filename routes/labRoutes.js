const express = require('express');
const router = express.Router();
const Lab = require('../models/labModel')

router.post('/postLab', async (req, res) => {
    try {
        const lab = new Lab(req.body);
        await lab.save();
        res.status(201).json(lab);
    }
    catch (err) {
        res.status(404).json({ message: err.message });
    }

});
router.get('/getLab', async (req, res) => {
    try {
        const labs = await Lab.find();
        res.json(labs);
    }
    catch(err) {
        res.status(500).json({ message: err.message })
    }
})
module.exports = router;