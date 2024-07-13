const express = require("express")
const router = express.Router()
const jwt = require('jsonwebtoken')
const User = require('../models/userModel');
const verifyToken=require('../middleware');
const bcrypt=require('bcrypt');

router.post('/userSignup', async (req, res) => {
    try {
        const newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phoneNo: req.body.phoneNo,
            mobileNo: req.body.mobileNo,
            department: req.body.department,
            picture: req.body.picture,
            sex: req.body.sex,
            bloodGroup: req.body.bloodGroup,
            address: req.body.address,
            specialist: req.body.specialist,
            careerTitle: req.body.careerTitle,
            biography: req.body.biography,
            status: req.body.status,
            email: req.body.email,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword,
            termCondition: req.body.termCondition,
            role: req.body.role,
        })
        const passwordCheck = newUser.password == newUser.confirmPassword
        if (!passwordCheck) {
            return res.json({ message: 'password doesnot match' })
        }
        await newUser.save();
        res.json({ message: 'Password saved' })
    }
    catch (error) {
        console.log(error);
    }
})
router.get('/getDoctorsByDepartment/:department', async (req, res) => {
  const department = req.params.department;
  try {
    const doctors = await Doctors.find({ department });
    res.status(200).json(doctors.map(doctor => doctor.name));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctors', error });
  }
});


router.get('/register', (req, res) => {
    User.find()
        .then(data => res.send(data))
        .catch(err => console.log(err))
})

router.get('/getDoctors', async (req, res) => {
    try {
      const doctors = await User.find({ role: 'doctor' });
      res.status(200).json({ doctors: doctors });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching doctors', error });
    }
  });
  
  router.get('/getPatients', async (req, res) => {
    try {
      const patients = await User.find({ role: 'patient' });
      res.status(200).json(patients);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching patients', error });
    }
  });
  
  router.get('/getLabtecs', async (req, res) => {
    try {
      const labtecs = await User.find({ role: 'labtec' });
      res.status(200).json({labtecs: labtecs});
    } catch (error) {
      res.status(500).json({ message: 'Error fetching lab technicians', error });
    }
  });


// router.post('/postLogin', async (req, res) => {
//     const { email, password } = req.body;
//     const findUser = await User.findOne({ email });
//     if (!findUser) {
//         return res.json({ message: 'username not found' })
//     }
//     const isPasswordMatch = password === findUser.password;
//     if (!isPasswordMatch) {
//         console.log('password is incorrect');
//         return res.json({ message: 'Incorrect password' });
//     }
//     const userRole = findUser.role;
//     const token = jwt.sign({ email: findUser.email, userId: findUser._id , firstName: findUser.firstName , phone: findUser.phone}, 'secretKey');
//     res.json({ message: 'Login Sucessfull', role: userRole, token: token });


// })
///
// router.post('/signin', async (req, res) => {
//   try {
//       const { email, password } = req.body;
//       const userData = await User.findOne({ email });
//       if (!userData) {
//           console.log(error);
//           return res.json({ message: 'username is not found ' });
//       }
//       if(userData.isVerified !=true){
//         return res.json({ message: 'User is not verified. Please verify before login! ',userData });
//       }
//       const userPasswordMatch = await bcrypt.compare(password, userData.password);
//       if (!userPasswordMatch) {
//           console.log('password doesnot match ');
//           return res.json({ message: 'password is incorrect' });
//       }
//       const userRole = userData.role;
//       const token = jwt.sign({ email: userData.email, userId: userData._id , firstName: userData.firstName , phoneNo: userData.phoneNo , userRole: userData.role }, 'secretKey');

//       res.json({ message: 'Login Sucessfull', role: userRole, token: token });
//   }
//   catch (error) {
//       res.json({ message: 'something went wrong', error });

//   }
// })

router.post('/signin', async (req, res) => {
  try {
      const { email, password } = req.body;
      const userData = await User.findOne({ email });
      if (!userData) {
          console.log(error);
          return res.json({ message: 'username is not found ' });
      }
      if(userData.isVerified !=true){
        return res.json({ message: 'User is not verified. Please verify before login! ',userData });
      }
      const userPasswordMatch = await bcrypt.compare(password, userData.password);
      if (!userPasswordMatch) {
          console.log('password doesnot match ');
          return res.json({ message: 'password is incorrect' });
      }
      const userRole = userData.role;
      const token = jwt.sign({ email: userData.email, userId: userData._id , firstName: userData.firstName , phoneNo: userData.phoneNo , userRole: userData.role }, 'secretKey');

      res.json({ message: 'Login Sucessfull', role: userRole, token: token });
  }
  catch (error) {
      res.json({ message: 'something went wrong', error });

  }
})

router.get('/getusersdatabyEmail', verifyToken, async (req, res) =>{
    try{
            const { email } = req.user;
            const userdata= await User.findOne({email});
            if(userdata){
                return res.json({ data: userdata });
            }
            else{
                res.status(404).json({message: "data not found"});
            }
    }catch(error)
    {
        res.status(500).json({ messgae: 'something is error', error });
    }
  })

  router.put('/updateuser/:id',verifyToken, async (req, res) => {
    try {
        const { firstName, lastName, phoneNo }=req.body;

      const user = await User.findByIdAndUpdate(req.params.id, { firstName, lastName, phoneNo }, { new: true });
      if (!user) {
        return res.status(404).send({message:"Schedule not found"});
      }
      res.send({message:"schedule updated successfully",user});
    } catch (error) {
      res.status(500).send(error);
    }
  });

  router.put('/changepassword/:id',verifyToken, async (req, res) => {
    try {
        const { oldpassword, password, confirmPassword }=req.body;
        const pass = await User.findbyId(req.params.id);
        if(pass.password!= pass.confirmPassword != oldpassword){
            res.status(404).send("old Password doesn't match");
        }
        else{
            if(password != confirmPassword){
                res.status(404).send("New Password doesn't match");
            }
            const user = await User.findByIdAndUpdate(req.params.id, { password, confirmPassword }, { new: true });
            if (!user) {
            return res.status(404).send({message:"Schedule not found"});
           }
           res.send({message:"schedule updated successfully",user});
        }
      
    } catch (error) {
      res.status(500).send(error);
    }
  });

module.exports = router;