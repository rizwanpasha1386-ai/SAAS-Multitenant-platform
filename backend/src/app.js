require("dotenv").config();
const express=require('express')
const cookieParser = require("cookie-parser");
const cors=require('cors')
const connectDB=require('./config/Dbconnection')
const authroute=require('./routes/auth.route')
const projectroute=require('./routes/project.route')
const taskroute=require('./routes/task.route')
const tenantroute=require('./routes/tenant.route')

const app=express()
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json())
connectDB()

app.use('/api/auth',authroute)
app.use('/api/tenant',tenantroute)
app.use('/api/project',projectroute)
app.use('/api/task',taskroute)

const PORT=process.env.PORT || 5000
app.listen(PORT,()=>{
    console.log("Server started successfully at ",PORT)
})