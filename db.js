const mongoose= require('mongoose');
const mongodb = require ('mongodb');

mongoose
.connect("mongodb+srv://sunitaadhikari2001:sunita@cluster0.kjvmfmf.mongodb.net/hospital-automation", {
   useNewUrlParser: true, 
   useUnifiedTopology: true, 
   family: 4,
 })
 .then(()=>{
    console.log('database is connected');
   
 })
 .catch((error)=>{
    console.log("error ",error);
})


    // "mongodb+srv://sunitaadhikari2001:sunita@cluster0.kjvmfmf.mongodb.net