require("dotenv").config();
const express=require('express')
const http = require("http");
const { Server } = require("socket.io");
const socketAuth = require("./middlewares/socket.auth");
const cookieParser = require("cookie-parser");
const cors=require('cors')
const connectDB=require('./config/Dbconnection')
const authroute=require('./routes/auth.route')
const projectroute=require('./routes/project.route')
const taskroute=require('./routes/task.route')
const tenantroute=require('./routes/tenant.route')
const projectChatSocket = require("./sockets/projectchat.socket");

const app=express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});
io.use(socketAuth)
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

io.on("connection", (socket) => {
  console.log("Socket Connected:", socket.user.name);

  projectChatSocket(io, socket);

  socket.on("disconnect", () => {
    console.log("Socket Disconnected");
  });
});

const PORT=process.env.PORT || 5000
server.listen(PORT,()=>{
    console.log("Server started successfully at ",PORT)
})