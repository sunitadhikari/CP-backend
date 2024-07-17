const express = require('express');
const router = express.Router();
const Ward = require('../models/wardModel');

router.get('/getwards', async (req, res) => {
  try {
    const wards = await Ward.find();
    res.json(wards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/postWards', async (req, res) => {
  const ward = new Ward({
    wardType: req.body.wardType,
    capacity: req.body.capacity,
  });

  try {
    const newWard = await ward.save();
    res.status(201).json(newWard);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// More routes for updating and deleting wards can be added similarly

module.exports = router;
