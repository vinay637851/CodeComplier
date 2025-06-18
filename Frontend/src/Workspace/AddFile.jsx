import {React} from 'react'
import {X} from 'lucide-react'
import {Link,useParams,useNavigate} from 'react-router-dom'
import {ToastContainer, toast } from "react-toastify";


function AddFile() {
    let {id,user_uid}=useParams();
    const navigate = useNavigate();
    async function handleForm(e) {
        e.preventDefault();
        let res=await fetch(`http://localhost:3000/code/workplace/stroage/files/create/${user_uid}/${id}`, {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                file_name:e.target.file_name.value,
                language:e.target.language.value,
            })
        })
        let data=await res.json();
        if(data.message){
            toast.success(data.message)
            setTimeout(() => {
                navigate(`/code/workplace/stroage/files/${id}/${user_uid}`)
            }, 1500);
        }
        else
            toast.error(data.error)
        e.target.reset();
    }
  return (
    <div className='absolute top-0 left-0 w-screen h-screen bg-gray-950 bg-opacity-90 flex justify-center items-center z-2'>
          <ToastContainer position="top-center" autoClose={1000} theme="dark" />
        <form action="" onSubmit={handleForm} className='w-1/3 h-max bg-gray-900 p-5 rounded-lg flex flex-col gap-5 text-white'>
            <span className='text-2xl flex justify-between items-center'>Create New File  <Link to={`/code/workplace/stroage/files/${id}/${user_uid}`}><X size={20} className='text-gray-500 cursor-pointer' /></Link></span>
            <label htmlFor="" className='flex flex-col gap-2'>File Name
                <input type="text" name="file_name" required placeholder='Enter file name' className='w-full p-3 bg-gray-800 rounded-lg outline-0 focus:outline-1 focus:outline-blue-600'/>
            </label>
            <label htmlFor="" className='flex flex-col gap-2'>Language
                <select name="language" id="language" className='w-full p-3 bg-gray-800 rounded-lg outline-0 focus:outline-1 focus:outline-blue-600'>
                    <option value=".cpp">C++</option>
                    <option value=".java">Java</option>
                    <option value=".py">Python</option>
                </select>
            </label>
            <span className='flex justify-end w-full gap-4'>
                <Link to={`/code/workplace/stroage/files/${id}/${user_uid}`}><button className='cursor-pointer rounded-lg px-3 py-2 bg-gray-800 hover:bg-gray-700'>Cancel</button></Link>
                <button type="submit" className='cursor-pointer rounded-lg px-3 py-2 bg-blue-800 hover:bg-blue-600'>Create File</button>
            </span>
        </form>

    </div>
  )
}

export default AddFile