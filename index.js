const express = require('express');
const app = express();
const connectDb = require('./db')
const cors = require('cors')
const userRouter = require('./routes/userRoutes')
const doctorRouter = require('./routes/doctorRoute')
const departmentRoute = require('./routes/departmentRoute')

app.use(express.json())
app.use(cors());
app.use(userRouter);
app.use(doctorRouter);
app.use(departmentRoute);
app.listen(3000, () => {
    console.log('Localhost is connected to 3000')
})