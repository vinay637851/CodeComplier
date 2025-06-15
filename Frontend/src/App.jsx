import CodeEditorTerminal from "./CodeEditorTerminal"
import Home from "./Home"
import Workspace from "./Workspace"
import FileList from "./FileList"
import AddFile from "./AddFile"
import Signup from "./Signup"
import Login from "./Login"

import { ref, get, child } from "firebase/database";
import { auth,database } from "./firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

import './App.css'

import { BrowserRouter, Routes, Route,Navigate} from "react-router-dom";

function App() {
  const [user, setUser] = useState(null);

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
    });

    return () => unsubscribe();
  }, []);



  return (
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<Home user={user}/>}/>
          <Route path="/login" element={<Login/>}></Route>
          <Route path="/signup" element={<Signup/>}></Route>
          <Route path="/code/workplace" element={user?<CodeEditorTerminal/>:<Navigate to="/login"/>} />
          <Route path="/code/workplace/stroage" element={user?<Workspace user={user}/>:<Navigate to="/login"/>}/>
          <Route path="/code/workplace/stroage/files/:id/:user_uid" element={user?<FileList/>:<Navigate to="/login"/>}/>
          <Route path="/code/workplace/stroage/files/:id/:user_uid/add" element={user?<AddFile/>:<Navigate to="/login"/>}/>
          <Route path="/" element={<Home/>}/>
          <Route path="/code/workplace" element={<CodeEditorTerminal/>} />
          <Route path="/code/workplace/stroage" element={<Workspace/>}/>
          <Route path="/code/workplace/stroage/files/:id" element={<FileList/>}/>
          <Route path="/code/workplace/stroage/files/:id/add" element={<AddFile/>}/>

        </Routes>
      </BrowserRouter>   
  )
}

export default App
