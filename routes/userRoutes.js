const express = require("express")
const router = express.Router()
const jwt = require('jsonwebtoken')
const User = require('../models/userModel');
const verifyToken=require('../middleware');


router.post('/userSignup', async (req, res) => {
    try {
        const newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phone: req.body.phone,
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


router.get('/register', (req, res) => {
    User.find()
        .then(data => res.send(data))
        .catch(err => console.log(err))
})


router.post('/postLogin', async (req, res) => {
    const { email, password } = req.body;
    const findUser = await User.findOne({ email });
    if (!findUser) {
        // console.log(error);
        return res.json({ message: 'username not found' })
    }
    const isPasswordMatch = password === findUser.password;
    if (!isPasswordMatch) {
        console.log('password is incorrect');
        return res.json({ message: 'Incorrect password' });
    }
    const userRole = findUser.role;
    const token = jwt.sign({ email: findUser.email, userId: findUser._id , firstName: findUser.firstName , phone: findUser.phone}, 'secretKey');
    res.json({ message: 'Login Sucessfull', role: userRole, token: token });


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
module.exports = router;