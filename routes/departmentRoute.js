const express = require('express');
const router = express.Router();
const Department = require('../models/departmentModel');
const verifyToken=require('../middleware');


router.post('/addDepartment',verifyToken, async (req, res) => {
  try {
    const department = new Department(req.body);
    await department.save();
    res.status(201).send(department);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('/getDepartment',verifyToken, async (req, res) => {
  try {
    const departments = await Department.find({});
    res.send(departments);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get('/getdepartment:id',verifyToken, async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).send();
    }
    res.send(department);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.put('/putDepartment/:id', verifyToken, async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!department) {
      return res.status(404).send();
    }
    res.send(department);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete('/delDepartment/:id',verifyToken, async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) {
      return res.status(404).send();
    }
    res.send(department);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
