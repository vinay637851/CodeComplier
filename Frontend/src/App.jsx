import CodeEditorTerminal from "./Editor/CodeEditorTerminal"
import Home from "./Home"
import Workspace from "./Workspace/Workspace"
import FileList from "./Workspace/FileList"
import AddFile from "./Workspace/AddFile"
import Signup from "./Authenticate/Signup"
import Login from "./Authenticate/Login"
import EditWorkspace from "./Workspace/EditWorkspace" 
import Room from "./Codeshare/Room"
import Playground from "./Codeshare/Playground"

import { ref, get, child } from "firebase/database";
import { auth,database } from "./Authenticate/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

import './App.css'

import { BrowserRouter, Routes, Route,Navigate} from "react-router-dom";
function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const dbRef = ref(database);
          const snapshot = await get(child(dbRef, `users/${firebaseUser.uid}`));

          if (snapshot.exists()) {
            setUser(snapshot.val());
          } else {
            const fallbackUser = {
              uid: firebaseUser.uid,
              name: firebaseUser.displayName || "Unknown",
              email: firebaseUser.email,
              profilePicture: firebaseUser.photoURL || "profile.png",
            };
            setUser(fallbackUser);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false); 
    });

    return () => unsubscribe();
  }, []);

  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen bg-gray-950">
  //       <div className="flex flex-col items-center gap-4">
  //         <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
  //         <p className="text-lg font-medium text-white">Please Wait Loading...</p>
  //       </div>
  //     </div>
  //   );
  // }


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home user={user}/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/room" element={<Room/>}/>
        <Route path="/room/playground" element={<Playground/>}/>
        <Route path="/code/workplace" element={user ? <CodeEditorTerminal/> : <Navigate to="/login"/>}/>
        <Route path="/code/workplace/stroage" element={user ? <Workspace user={user}/> : <Navigate to="/login"/>}/>
        <Route path="/code/workplace/stroage/files/:id/:user_uid" element={user ? <FileList/> : <Navigate to="/login"/>}/>
        <Route path="/code/workplace/stroage/files/:id/:user_uid/add" element={user ? <AddFile/> : <Navigate to="/login"/>}/>
        <Route path="/code/workplace/stroage/edit/:id/:user_uid/:folder_name/:description" element={user ? <EditWorkspace/> : <Navigate to="/login"/>}/>
      </Routes>
    </BrowserRouter>
  );
}


export default App
