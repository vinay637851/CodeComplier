let mongoose=require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URL)
.then(function(res){
    console.log("Connected to database successfully");
})
.catch(function(err){
    console.log("Error in connecting to database",err);
})
module.exports=mongoose;