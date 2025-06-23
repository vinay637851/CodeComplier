let express=require("express");
let app=express();
let port=process.env.PORT||3000;
require("dotenv").config();

let path=require("path");
const cors = require('cors');
let bodyParser=require('body-parser') 
let mongoose=require("./database.js")
const { ObjectId } = require('mongodb'); 
const fileUpload = require('express-fileupload'); 



let http=require('http');
let server=http.createServer(app);
let io=require('socket.io')(server, {
  cors: {
    origin:[ "http://localhost:5173", "https://code-complier-git-main-vinay637851s-projects.vercel.app"],  
    methods: ["GET", "POST"]
  }
});


app.use(cors());
app.use("/codemirror-5.65.19",express.static("C:/Users/KK/Desktop/MERN code editor/code_editor_project/Backend/node_modules/codemirror"))
app.use(bodyParser.json())
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname)));
app.use(express.json());
app.use(fileUpload());
 

// io.on("connection", (socket) => {
//   console.log("A user connected with ID:", socket.id);
//   socket.on("send_message", (msg) => {
//     console.log("Message received:", msg);
//     socket.broadcast.emit("receive_message", msg);
//   });
// });


server.listen(port,function(){
    console.log("server started on port ",port)
})  

const codeRouter = require('./code');
app.use('/code', codeRouter);
