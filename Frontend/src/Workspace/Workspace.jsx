import {Link,useNavigate} from "react-router-dom"
import { House ,Plus,ChevronLeft,FileCode2,Dot,Trash2,Calendar,Code2} from "lucide-react";
import {ToastContainer, toast } from "react-toastify";
import { useState ,useEffect} from "react";



function Codebase({user}) {
  let [arr,Setarr]=useState(null);
  useEffect(function(){
    getWorkspaces()
    async function getWorkspaces(){
      try{
        let res=await fetch("http://localhost:3000/code/workplace/stroage/get",{
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({
            user_id:user.uid
          })
        })
        let data=await res.json();
        console.log(data.workspaces)
        Setarr([...data.workspaces])
        return;
      }
      catch(err){
        console.log(err);
        return;
      }
    }
  },[user])
  function ShowWorkspaceform(){
    document.getElementById("Show_Button").classList.toggle("hidden")
    document.getElementById("Workspace_place").classList.toggle("hidden");
    if(document.getElementById("Workspace_form").classList.contains("hidden")){
      document.getElementById("Workspace_form").classList.remove("hidden")
      document.getElementById("Workspace_form").classList.add("flex");
    }
    else{
      document.getElementById("Workspace_form").classList.remove("flex")
      document.getElementById("Workspace_form").classList.add("hidden");
    }
  }
  async function handleForm(e){
    e.preventDefault();
    try{
      let res=await fetch("http://localhost:3000/code/workplace/stroage/create",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          folder_name:e.target.folder_name.value,
          folder_description:e.target.folder_description.value,
          user_id:user.uid
        })
      })
      let data=await res.json();
      console.log(data.workspaces)
      if(data.message==="workspace already exists"){
        toast.warning(data.message);
        e.target.reset();
      }
      else{
        toast.success(data.message)
        Setarr([...data.workspaces])
        ShowWorkspaceform()
      }
    }
    catch(err){
      console.log(err);
    }
    e.target.reset();
  }
  async function DeleteWorkspace(id){
    console.log(id)
    try{
      let res=await fetch("http://localhost:3000/code/workplace/stroage/delete",{
        method:"DELETE",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          id:id,
          user_id:user.uid
        })
      })
      let data=await res.json();
      console.log(data.workspaces)
      Setarr([...data.workspaces])
      toast.success(data.message)
      return;
    }
    catch(err){
      console.log(err);
      return;
    }
  }

  return (
    <div className="w-screen bg-gray-950 min-h-screen h-max flex flex-col">
      <ToastContainer position="top-center" autoClose={2000} theme="dark" />
        <div className="h-[10vh] bg-gray-900 flex justify-between px-10 z-1 items-center sticky top-0">
            <Link to="/"><House className="text-gray-300"/></Link>
            <div className="flex gap-3 items-center">
              <Link to="/code/workplace"><span className="flex gap-1 px-4 py-3 bg-gray-950 text-white text-sm rounded-lg cursor-pointer duration-100 hover:bg-gray-800"><Code2 size={20}/> Create Playground</span></Link>
              <button id="Show_Button" className="flex gap-1 bg-blue-600 px-2 py-2 rounded-lg text-white text-base hover:bg-blue-700 cursor-pointer" onClick={ShowWorkspaceform}><Plus/> Create Workspace</button>
            </div>
        </div>
        <div className="h-max relative">
          <div id="Workspace_form" className="bg-gray-950 w-screen h-[90vh] hidden absolute justify-center  items-center text-white">
            <div className="w-2/3 p-5 flex flex-col gap-5">
              <span className="flex gap-1 cursor-pointer" onClick={ShowWorkspaceform}><ChevronLeft/> Back to Workspace</span>
              <form action="" onSubmit={handleForm} className="bg-gray-900 flex flex-col gap-10 p-5 rounded-lg">
                <h1 className="text-3xl font-semibold">Create a new workspace</h1>
                <label htmlFor="" className="flex flex-col gap-2"> Workspace name
                  <input type="text" name="folder_name" required  className="w-full p-2 bg-gray-800 rounded-lg  focus:outline-blue-400 focus:outline-1" />
                </label>
                <label htmlFor="" className="flex flex-col gap-2"> Description (optional)
                  <textarea name="folder_description"  rows={5} placeholder="Description of your workspace" className="w-full p-2 resize-none bg-gray-800 rounded-lg focus:outline-blue-400 focus:outline-1"></textarea>
                </label>
                <button type="submit" className="py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 cursor-pointer text-lg">Create workspace</button>
              </form>
            </div>
          </div>
          <div id="Workspace_place" className="w-screen h-max bg-gray-950 absolute flex gap-10 flex-col  text-white  p-10">
              {arr!=null?(arr.map(function(ele,idx){
                return <Container key={idx} id={ele._id} title={ele.folder_name} description={ele.folder_description} folder_date={ele.folder_date} totalFiles={ele.files?ele.files.length:0}/>
              })):null}
          </div>
        </div>
    </div>
  );
  function Container({ id, title, description, totalFiles, folder_date }) {
    const navigate = useNavigate();

    function handleCardClick() {
      navigate(`/code/workplace/stroage/files/${id}/${user.uid}`);
    }

    function handleDeleteClick(e) {
      e.preventDefault();
      e.stopPropagation();
      DeleteWorkspace(id);
    }

    return (
      <div
        onClick={handleCardClick}
        className="bg-gray-800 hover:bg-gray-700 transition-all duration-200 cursor-pointer text-white p-5 rounded-2xl shadow-sm hover:shadow-lg group flex flex-col justify-between h-40"
      >
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold truncate max-w-[85%] leading-tight">
            {title}
          </h1>
          <Trash2
            size={20}
            onClick={handleDeleteClick}
            className="text-gray-400 hover:text-red-500 transition-colors duration-150"
          />
        </div>

        <p className="text-base text-gray-400 line-clamp-2 mr-2 mb-1 leading-snug">
          {description || <span className="italic text-gray-500">No description</span>}
        </p>

        <div className="flex justify-between items-end text-sm text-gray-300 leading-none">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <FileCode2 size={16} />
              <span>{totalFiles} File{totalFiles !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-400">
              <Calendar size={14} />
              <span>{folder_date}</span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-sm">
            <Dot className="text-green-500" size={18} />
            <span className="text-green-400 font-semibold">Active</span>
          </div>
        </div>
      </div>
    );
  }

}



export default Codebase;