const express = require('express');
const app = express();
const connectDb  = require('./db')
const cors = require('cors')
const userRouter = require('./routes/userRoutes')
const doctorNew = require('./routes/doctorRoutes')

app.use(express.json())
app.use(cors());
app.use(userRouter);
app.use(doctorNew);
app.listen(3000, ()=>{
    console.log('Localhost is connected to 3000')
})