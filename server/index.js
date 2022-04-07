const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const messageRouter = require("./routes/messagesRoute");
const socket = require("socket.io");
const path = require("path");
const PORT = process.env.PORT||5000 

const app = express();
require("dotenv").config();

//midlewaeres

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "./frontendd/build")));

//Database Connection
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("DB connection successfully")
}).catch((err)=>{
    console.log(err.message)
})




//Routes
app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRouter);
app.get("*",function(_,res){
    res.sendFile(
      path.join(__dirname,"./frontendd/build/index.html"),
      function(err){
        if(err){
          res.status(500).send(err);

        }
      }
    )
})  




const server = app.listen(PORT , ()=>{
    console.log(`Server Started on Port ${process.env.PORT}`)
})


const io = socket(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });
  
  global.onlineUsers = new Map();
  io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
      onlineUsers.set(userId, socket.id);
    });
  
    socket.on("send-msg", (data) => {
      const sendUserSocket = onlineUsers.get(data.to);
      if (sendUserSocket) {
        socket.to(sendUserSocket).emit("msg-recieve", data.msg);
      }
    });
  });

