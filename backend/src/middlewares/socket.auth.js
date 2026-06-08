const jwt=require('jsonwebtoken')
const USER=require('../models/user.model')
const cookie=require('cookie')

const socketAuth=async(socket,next)=>{
    try{
        const cookies=cookie.parse(socket.handshake.headers.cookie||"")

        const token=cookies.token
        if(!token){
            return next(new Error("UNAUTHORIZED"))
        }
        const decoded = jwt.verify(   
            token,
            process.env.JWT_SECRET
        );
        const user = await USER.findById(decoded.userId)
        .select("-password");
        if (!user) {
        return next(new Error("User not found"));
        }
        socket.user = user;
        next();
    }
    catch (error) {
    next(new Error("Socket authentication failed"));
  }
}

module.exports = socketAuth;