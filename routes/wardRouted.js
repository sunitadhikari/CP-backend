const express = require('express');
const router = express.Router();
const Ward = require('../models/wardModel');

router.get('/getwards', async (req, res) => {
  try {
    const wards = await Ward.find();
    // const wardCount = await Ward.countDocuments({});

    res.json(wards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// router.post('/postWards', async (req, res) => {
//   const ward = new Ward({
//     wardType: req.body.wardType,
//     capacity: req.body.capacity,
//   });

//   try {
//     const newWard = await ward.save();
//     res.status(201).json(newWard);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });
router.post('/postWards', async (req, res) => {
  // const wardType = req.body.wardType.toLowerCase(); 
  const wardType = req.body.wardType // Convert to lowercase

  // Check if wardTy already exists
  try {
    const existingWard = await Ward.findOne({ wardType: wardType });
    if (existingWard) {
      return res.status(400).json({ message: 'Ward type already exists' });
    }

    const ward = new Ward({
      wardType: wardType,
      capacity: req.body.capacity,
    });

    const newWard = await ward.save();
    res.status(201).json(newWard);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
router.put('/editWard/:id', async (req, res) => {
  try {
    const ward = await Ward.findById(req.params.id);
    if (!ward) {
      return res.status(404).json({ message: 'Ward not found' });
    }

    ward.wardType = req.body.wardType.toLowerCase();
    ward.capacity = req.body.capacity;

    const updatedWard = await ward.save();
    res.json(updatedWard);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/deleteWard/:id', async (req, res) => {
  try {
    const ward = await Ward.findById(req.params.id);
    if (!ward) {
      return res.status(404).json({ message: 'Ward not found' });
    }

    await ward.remove();
    res.json({ message: 'Ward deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get('/bedsStatus', async (req, res) => {
  try {
    const ward = req.query.ward;
    const occupied = req.query.occupied;
    let beds;
    if (ward && occupied !== undefined) {
      beds = await Bed.find({ ward: ward, occupied: occupied === 'true' });
    } else if (ward) {
      beds = await Bed.find({ ward: ward });
    } else {
      beds = await Bed.find();
    }
    res.json(beds);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
