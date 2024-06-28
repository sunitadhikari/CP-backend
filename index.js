const express = require('express');
const app = express();
const connectDb = require('./db')
const cors = require('cors')
const userRouter = require('./routes/userRoutes')
const doctorRouter = require('./routes/doctorRoute')
const departmentRoute = require('./routes/departmentRoute')
const roomRoute = require('./routes/roomRoute')
const bedRoute = require('./routes/bedRoute')
const patientRoutes = require('./routes/patientRoutes')
const emailRoutes = require('./routes/emailRoutes')
const symptoms = require('./routes/symptomsRoute')
const appointment = require('./routes/appointmentRoute')
const lab = require('./routes/labRoutes')
const schedule = require('./routes/scheduleRoutes')
const appoitntmentHistory = require('./routes/appointment-historyRoute')
const note = require('./routes/doctornoteRoute')

app.use(express.json())
app.use(cors());
app.use(userRouter);
app.use(doctorRouter);
app.use(departmentRoute);
app.use(roomRoute);
app.use(patientRoutes);
app.use(bedRoute);
app.use(emailRoutes);
app.use(symptoms);
app.use(appointment);
app.use(lab);
app.use(appoitntmentHistory);
app.use(schedule);
app.use(note);





app.listen(3000, () => {
    console.log('Localhost is connected to 3000')
})