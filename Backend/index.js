let express=require("express");
let app=express();
let port=process.env.PORT||3000
let path=require("path");
const cors = require('cors');
let bodyParser=require('body-parser') 
let mongoose=require("./database.js")
const { ObjectId } = require('mongodb'); 
const fileUpload = require('express-fileupload'); 

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.use(cors());
app.use("/codemirror-5.65.19",express.static("C:/Users/KK/Desktop/MERN code editor/code_editor_project/Backend/node_modules/codemirror"))
app.use(bodyParser.json())
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname)));
app.use(express.json());
app.use(fileUpload());



app.listen(port,function(){
    console.log("server started on port ",port)
})  

const codeRouter = require('./code');
app.use('/code', codeRouter);

// app.post("/user/login", async (req, res) => {
//   try {
//     const { idToken } = req.body;
//     const decodedToken = await admin.auth().verifyIdToken(idToken);
//     const uid = decodedToken.uid;
//     console.log("token:", idToken);
//     console.log("Decoded UID:", uid);
//     console.log("Decoded Token:", decodedToken);
//     let db = mongoose.connection.db;
//     let Accounts = db.collection("accounts");
//     let user = await Accounts.findOne({ uid });

//     if (!user) {
//       return res.status(401).send({ message: "User not found. Please signup first." });
//     }

//     res.send({
//       message: "Login successful",
//       user: { uid: user.uid, email: user.email, name: user.name },
//     });
//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(401).send({ message: "Invalid or expired token." });
//   }
// });

// app.post("/user/signup",async function(req,res){
//     let {email,uid,name,token}=req.body;
//     let db=mongoose.connection.db;
//     let Accounts=db.collection("accounts");
//     let check=await Accounts.findOne({uid:uid});
//     if(check){
//         return res.send({message:"User already exists"});
//     }  
//     await Accounts.insertOne({uid:uid,name:name,email:email,token:token||" "});
//     console.log(email,uid,name);
//     res.send({message:"Signup successful"});
// })
