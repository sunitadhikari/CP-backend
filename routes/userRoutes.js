const express = require("express")
const router = express.Router()
const jwt = require('jsonwebtoken')
const user = require('../models/userModel');

router.post('/userSignup', async (req, res) => {
    try {


        const newUser = new user({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword
        })
        const passwordCheck = newUser.password == newUser.confirmPassword
        if (!passwordCheck) {
            return res.json({ message: 'password doesnot match' })
        }
        await newUser.savse();
        res.json({ message: 'Password saved' })
    }
    catch (error) {
        console.log(error);
    }
})


router.get('/getUserSignup', (req, res) => {
    user.find()
        .then(data => res.send(data))
        .catch(err => console.log(err))
})


router.post('/postLogin', async (req, res) => {
    const { username, password } = req.body;
    user.findOne({ username });
    if (!userData) {
        return res.status(401)({ message: 'username not found' })
    }
    const isPasswordMatch = password === userData.confirmPassword;
    try{
        if (!isPasswordMatch) {
            console.log('password is incorrect');
            return res.status(401).json({ message: 'Incorrect password' });
        }  
    }
    catch(error){
        console.log(error);
        res.json({message:'Internal server error'})
    }
})
module.exports = router;