const express = require("express")
const router = express.Router()
const jwt = require('jsonwebtoken')
const user = require('../models/userModel');

router.post('/userSignup', async(req, res) => {
    try{

    
    const newUser = new user({
        username:req.body.username,
        email:req.body.email,
        password:req.body.password,
        confirmPassword:req.body.confirmPassword
    })
    const passwordCheck = newUser.password == newUser.confirmPassword
    if(!passwordCheck){
        return res.json({message:'password doesnot match'})
    }
    await newUser.save();
    res.json({message:'Password saved'})
}
catch(error){
    console.log(error);
}
})

module.exports = router;