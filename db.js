const mongoose = require("mongoose")
const mongodb = require('mongodb')

// mongoose.connect("mongodb+srv://anish:anish@cluster0.xuf0z19.mongodb.net/restaurantsun", {
mongoose.connect("mongodb+srv://sunitaadhikari2001:sunita@cluster0.kjvmfmf.mongodb.net/hospital-automation", {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    family: 4,
    })

    .then(()=>{
        console.log('Database is connected');
    })
    .catch((error)=>{
        console.log('error occur');
    })