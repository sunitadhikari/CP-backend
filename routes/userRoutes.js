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
        await newUser.save();
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
    const { email, password } = req.body;
    const findUser = await user.findOne({ email });
    if (!findUser) {
        console.log(error);
        return res.json({ message: 'username not found' })
    }
    const isPasswordMatch = password === findUser.password;
    if (!isPasswordMatch) {
        console.log('password is incorrect');
        return res.json({ message: 'Incorrect password' });
    }
    const userRole = finsUser.role;
    res.json({message:'login sucessful ',role:userRole})


})
module.exports = router;