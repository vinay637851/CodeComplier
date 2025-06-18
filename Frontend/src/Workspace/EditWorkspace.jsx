import { useState } from "react";
import {useParams, Link} from "react-router-dom";
import {toast, ToastContainer} from "react-toastify";
import { X } from 'lucide-react';

function EditWorkspace() {
    let {id,user_uid,folder_name,description}=useParams();
    let [folder,SetFolder]=useState({
        name:folder_name,
        description:description=='-'?"":description
    })
    async function handleForm(e){
        e.preventDefault();
        let folder_name=e.target.folder_name.value;
        let folder_description=e.target.folder_description.value;
        let res=await fetch("http://localhost:3000/code/workplace/stroage/edit",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                folder_id:id,
                user_uid:user_uid,
                folder_name:folder_name,
                folder_description:folder_description
            })
        })
        let data=await res.json();
        toast.success(data.message);
        setTimeout(()=>{
            window.location.href=`/code/workplace/stroage/files/${id}/${user_uid}`;
        },2000);
        console.log(folder_name,folder_description);
    }
    return(
        <div className='absolute top-0 left-0 w-screen h-screen bg-gray-950 bg-opacity-90 flex justify-center items-center z-2'>
          <ToastContainer position="top-center" autoClose={1000} theme="dark" />
            <form action="" onSubmit={handleForm} className='w-1/3 h-max bg-gray-900 p-5 rounded-lg flex flex-col gap-5 text-white'>
                <span className='text-2xl flex justify-between items-center'>Edit Workspace Info.     <Link to={`/code/workplace/stroage/files/${id}/${user_uid}`}><X size={20} className='text-gray-500 cursor-pointer' /></Link></span>
                <label htmlFor="" className='flex flex-col gap-2'>Folder Name
                     <input type="text" name="folder_name" onChange={(e)=> SetFolder(...folder.name,e.target.value)} value={folder.name} required  className="w-full p-2 bg-gray-800 rounded-lg  focus:outline-blue-400 focus:outline-1" />
                </label>
                <label htmlFor="" className='flex flex-col gap-2'>Description
                    <textarea name="folder_description" onChange={(e)=> SetFolder(...folder.description,e.target.value)} value={folder.description}  rows={5} placeholder="Description of your workspace" className="w-full p-2 resize-none bg-gray-800 rounded-lg focus:outline-blue-400 focus:outline-1"></textarea>
                </label>
                <span className='flex justify-end w-full gap-4'>
                    <Link to={`/code/workplace/stroage/files/${id}/${user_uid}`}><button className='cursor-pointer rounded-lg px-3 py-2 bg-gray-800 hover:bg-gray-700'>Cancel</button></Link>
                    <button type="submit" className='cursor-pointer rounded-lg px-3 py-2 bg-blue-800 hover:bg-blue-600'>Edit Workspace</button>
                </span>
            </form>

        </div>
    )
}

export default EditWorkspace;