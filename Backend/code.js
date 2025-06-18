const express = require('express');
const router = express.Router();
const compiler = require("compilex");
const { ObjectId } = require('mongodb');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const SUPABASE_URL='https://vwuwivxqtsxffxzcyjlc.supabase.co';
const SUPABASE_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3dXdpdnhxdHN4ZmZ4emN5amxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyMzk5MDIsImV4cCI6MjA2MDgxNTkwMn0.WMexIJzTImrfJEkVCAzmwzI9wgSuPWB9LuHeYmHx4OI'


const supabase=createClient(SUPABASE_URL,SUPABASE_KEY)
const mongoose = require("./database.js");

compiler.init({ stats: true });

router.post("/workplace/compile",function(req,res){
    let {code,language,input}=req.body;  
    if(language=="C++"){
        var envData = { OS : "windows" , cmd : "g++", options: { timeout: 5000 }};  
        if(input){
            compiler.compileCPPWithInput(envData , code , input , function (data) {
                if (res.headersSent) return;
                if (data.error) {
                    res.send({ error: data.error });
                    return;
                }
                res.send({ output: data.output });
                compiler.flush(function(){console.log("Deleted")});
            }); 
        }
        else{
            compiler.compileCPP(envData , code , function (data) {
                if (res.headersSent) return;
                if (data.error) {
                    res.send({ error: data.error });
                    return;
                }
                res.send({ output: data.output });
                compiler.flush(function(){console.log("Deleted")}); 
            });
        }
    } 
    else if(language=="Java"){
        var envData = { OS : "windows", options: { timeout: 5000 }};
        if(input){
            compiler.compileJavaWithInput( envData , code , input ,  function(data){
                if (res.headersSent) return;
                if (data.error) {
                    res.send({ error: data.error });
                    return;
                }
                res.send({ output: data.output }); 
                compiler.flush(function(){console.log("Deleted")});
            });
        }
        else {
            compiler.compileJava( envData , code , function(data){
                if (res.headersSent) return;
                if (data.error) {
                    res.send({ error: data.error });
                    return;
                }
                res.send({ output: data.output });
                compiler.flush(function(){console.log("Deleted")}); 
            }); 
        }
    }
    else if(language=="Python"){
        var envData = { OS : "windows", options: { timeout: 5000 }};
        if(input){
            compiler.compilePythonWithInput( envData , code , input ,  function(data){
                if (res.headersSent) return;
                if (data.error) {
                    res.send({ error: data.error });
                    return;
                }
                res.send({ output: data.output }); 
                compiler.flush(function(){console.log("Deleted")});      
            });
        }
        else{
            compiler.compilePython( envData , code , function(data){
                if (res.headersSent) return;
                if (data.error) {
                    res.send({ error: data.error });
                    return;
                }
                res.send({ output: data.output }); 
                compiler.flush(function(){console.log("Deleted")}); 
            });   
        }
    } 
    
})

router.post("/workplace/stroage/get",async function(req,res){
    let {user_id}=req.body;
    let db=mongoose.connection.db;
    let Workspace=db.collection("workspace");
    let data=await Workspace.find({user_id:user_id}).toArray();
    res.send({workspaces:data});
    return;
})

router.post("/workplace/stroage/create",async function(req,res){
    let {folder_name,folder_description,user_id}=req.body;
    let db=mongoose.connection.db;
    let Workspace=db.collection("workspace");
    let data=await Workspace.findOne({folder_name:folder_name,user_id:user_id});
    console.log(data);
    if(data){
        let AllData=await Workspace.find({user_id:user_id}).toArray();
        res.send({message:"Workspace already exists",workspaces:AllData});
        return;
    }
    else{ 
        let date=new Date();
        await Workspace.insertOne({user_id:user_id,folder_name:folder_name,folder_description:folder_description,folder_date:date.toLocaleString()});
        let AllData=await Workspace.find({user_id:user_id}).toArray();
        res.send({message:"Workplace created",workspaces:AllData});
    }
})

router.post("/workplace/stroage/edit",async function(req,res){
    let {folder_id,user_uid,folder_name,folder_description}=req.body;
    let db=mongoose.connection.db; 
    let Workspace=db.collection("workspace");
    let file=await Workspace.findOne({_id:new ObjectId(folder_id)});
    if(!file){
        res.send({error:"Workspace not found"});
        return;
    }
    if(file.folder_name===folder_name && file.folder_description===folder_description){
        res.send({message:"No changes made"});
        return;
    }
    let old_folder_name=file.folder_name+"+"+user_uid;
    let new_folder_name=folder_name+"+"+user_uid;
    const { data: files, error } = await supabase
    .storage
    .from("workspacefiles")
    .list(old_folder_name); 
    if (files.length > 0) {
        const paths = files.map(file => `${old_folder_name}/${file.name}`);
        const { error: moveError } = await supabase
          .storage
          .from("workspacefiles")
          .move(paths, new_folder_name);
        if (moveError) {
            res.send({error:"Error moving files"});
            return;
        }
    }
    await Workspace.updateOne({_id:new ObjectId(folder_id)},{$set:{folder_name:folder_name,folder_description:folder_description}});
    res.send({message:"Workspace updated successfully"});
    return;
})

router.delete("/workplace/stroage/delete",async function(req,res){
    let {id,user_id}=req.body;
    let db=mongoose.connection.db; 
    let Workspace=db.collection("workspace");
    let file=await Workspace.findOne({_id:new ObjectId(id)});
    let folder_name=file.folder_name;
    const { data: files, error } = await supabase
    .storage
    .from("workspacefiles")
    .list(folder_name+"+"+user_id);
    const paths = files.map(file => `${folder_name+"+"+user_id}/${file.name}`);
    if (paths.length > 0) {
        const { error: deleteError } = await supabase
          .storage
          .from("workspacefiles")
          .remove(paths);
    }
    await Workspace.deleteOne({ _id: new ObjectId(id) });
    let AllData=await Workspace.find({user_id:user_id}).toArray();
    res.send({message:"Workplace deleted",workspaces:AllData});
}) 


router.post("/workplace/stroage/files/create/:user_uid/:folder_id",async function (req,res) {
    let {file_name,language}=req.body;
    let {user_uid,folder_id}=req.params;
    let db=mongoose.connection.db;
    let workspace=db.collection("workspace");
    let fileData=await workspace.findOne({_id:new ObjectId(folder_id)});
    const baseCode = {
        '.cpp': `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}`,
        '.java': `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`,
        '.py': `print("Hello, World!")`
    };
    console.log(baseCode[language])
    const { data, error } = await supabase.storage
    .from('workspacefiles')
    .upload(`/${fileData.folder_name+"+"+user_uid}/${file_name+language}`,baseCode[language],{
      upsert: true,
    });
    if(fileData.files){
        let isExist=fileData.files.findIndex((file)=>file.file_name===file_name+language);
        if(isExist!=-1){
            res.send({error:"File already exists"});
            return;
        }
    }
    let date=new Date();
    await workspace.updateOne({_id:new ObjectId(folder_id)},{$push:{files:{_id:new ObjectId(),file_name:file_name+language,file_date:date.toLocaleString()}}})
    res.send({message:"File created"});
    return; 
}) 

router.get("/workplace/stroage/files/access/:user_uid/:folder_id",async function(req,res){
    let {folder_id}=req.params;
    let db=mongoose.connection.db;
    let Workspace=db.collection("workspace");
    let data=await Workspace.findOne({_id:new ObjectId(folder_id)})
    res.send({files:data});
    return; 
})

router.post("/workplace/stroage/files/delete/:user_uid/:folder_id/:file_id",async function(req,res){
    let {user_uid,folder_id,file_id}=req.params;
    let db=mongoose.connection.db;
    let workspace=db.collection("workspace");
    let file=await workspace.findOne({_id:new ObjectId(folder_id)});
    let folder_name=file.folder_name;
    let file_name=file.files.find((file)=>file._id.toString()===file_id).file_name;
    const { data, error } = await supabase
    .storage
    .from('workspacefiles')     
    .remove([`${folder_name+"+"+user_uid}/${file_name}`]);
    await workspace.updateOne({_id:new ObjectId(folder_id)},{$pull:{files:{_id:new ObjectId(file_id)}}})
    res.send({message:"File deleted"});
})

router.get("/workplace/stroage/files/data/:user_uid/:folder_id/:file_id",async function(req,res){
    let {user_uid,folder_id,file_id}=req.params;
    let db=mongoose.connection.db; 
    let workspace=db.collection("workspace");
    let file=await workspace.findOne({_id:new ObjectId(folder_id)});
    let folder_name=file.folder_name;
    let file_name=file.files.find((file)=>file._id.toString()===file_id).file_name;
    const { data, error } = await supabase
    .storage
    .from('workspacefiles') 
    .createSignedUrl(`${folder_name+"+"+user_uid}/${file_name}`, 60);
    const response = await fetch(data.signedUrl); 
    const content = await response.text(); 
    res.send({code:content}); 
})

router.post("/workplace/stroage/files/data/upload/:user_uid/:folder_id/:file_id",async function(req,res){
    let {user_uid,folder_id,file_id}=req.params;
    let {code}=req.body;
    let db=mongoose.connection.db;
    let workspace=db.collection("workspace");
    let file=await workspace.findOne({_id:new ObjectId(folder_id)});
    let folder_name=file.folder_name;
    let file_name=file.files.find((file)=>file._id.toString()===file_id).file_name;
    const { data, error } = await supabase.storage
    .from('workspacefiles')
    .upload(`/${folder_name+"+"+user_uid}/${file_name}`,code,{
      upsert: true,
    });
    res.send({message:"File updated"});
})

module.exports = router;