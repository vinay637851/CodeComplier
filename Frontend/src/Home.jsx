import {Terminal,Rocket,Globe,Share2,Cpu,MonitorPlay,Code2} from "lucide-react"
import {Link} from "react-router-dom"
import { signOut } from "firebase/auth";
import { auth } from "./Authenticate/firebaseConfig";
import { useState,useEffect } from "react";
function Home({user}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const handleLogout = async () => {
    await signOut(auth);
  };
  useEffect(() => {
    
  }, [user]);
  return (
    <div className="w-screen min-h-screen flex flex-col  bg-gray-950">
        <div className="text-white h-[15vh] flex justify-between items-center px-10">
            <span className="text-3xl font-extrabold flex gap-2 items-center"><Code2 className="w-10 h-10 text-blue-400" /><h1 className="text-3xl font-bold text-white">Code Bit</h1></span>
            {user ? (
          <div className="relative">
            <img
              src={user.profilePicture}
              onError={(e) => (e.target.src = "profile.png")}
              alt="Profile"
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-10 h-10 rounded-full border border-gray-400 cursor-pointer hover:opacity-90 transition"
            />

            {showDropdown && (
              <div className="absolute right-0 mt-3 w-56 bg-gray-900 text-white rounded-xl shadow-lg p-4 border border-gray-700 z-50">
                <div className="mb-3">
                  <p className="text-sm font-semibold">{user.name}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full cursor-pointer bg-red-600 hover:bg-red-700 text-sm text-white py-2 rounded-lg transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex gap-3 items-center">
            <Link to="/signup">Sign up</Link>
            <Link
              to="/login"
              className="flex gap-1 px-4 py-2 border border-gray-500 text-white text-sm rounded-lg cursor-pointer hover:border-blue-600"
            >
              Get Started
            </Link>
          </div>
        )}

        </div>
        <div className="flex flex-col h-[85vh] py-10 justify-center items-center gap-5 ">
            <h1 className="text-white text-5xl font-bold text-center">Code Smarter, Build Faster</h1>
            <p className="text-gray-500 text-lg text-center max-w-xl ">A powerful, cloud-based code editor designed for modern development workflows. Write, collaborate, and Real-time Collaboration.</p>
            <div className="flex gap-3">
              <Link to="/room"><span className="flex gap-1 px-4 py-3 bg-blue-500 text-white text-sm rounded-lg cursor-pointer duration-100 hover:bg-blue-600"><Terminal size={20}/> Create Playground</span></Link>
              <Link to="/code/workplace/stroage"><span className="flex gap-1 px-4 py-3 bg-gray-700 text-white text-sm rounded-lg cursor-pointer duration-100 hover:bg-gray-800"><Rocket size={20}/> Create Workspace</span></Link>
            </div>
        </div>
        <div className="min-h-screen h-max flex flex-col items-center  justify-around ">
            <h1 className="text-3xl text-white font-bold">⚡ Powerful Features</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-10">
              <Container icon={Globe} title={"Multi-Language Support"} description={"Write and compile code in C++, Java, Python, and many more languages with intelligent syntax highlighting."}/>
              <Container icon={Share2} title={"Real-time Collaboration"} description={"Code together with your team in real-time. Share your workspace and collaborate efficiently."}/>
              <Container icon={Cpu} title={"Powerful Compiler"} description={"Built-in compiler support for multiple languages with detailed error reporting and debugging."}/>
              <Container icon={MonitorPlay} title={"Live Preview"} description={"See your changes in real-time with our integrated preview window for web development."}/>
              <Container icon={Terminal} title={"Integrated Terminal"} description={"Full-featured terminal with support for custom commands and multiple instances."}/>
              <Container icon={Rocket} title={"CodeBase Integration"} description={"Seamlessly integrate with your code base. Clone, commit, and manage your projects directly from the editor."}/>
            </div>
        </div>
        {/* Footer */}
        <div className="w-full bg-gray-950 text-gray-400 py-8 mt-20 px-10">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h2 className="text-white text-xl font-bold flex items-center gap-2"><Code2 size={22}/> Code Bit</h2>
              <p className="mt-2 text-sm text-gray-500">Code Smarter, Build Faster</p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-3">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="hover:text-white">Home</Link></li>
                <li><Link to="/code/workplace" className="hover:text-white">Editor</Link></li>
                <li><Link to="/code/workplace/stroage" className="hover:text-white">Workspace</Link></li>
                {!user && <>
                  <li><Link to="/login" className="hover:text-white">Login</Link></li>
                  <li><Link to="/signup" className="hover:text-white">Sign Up</Link></li>
                </>}
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-3">Stay Connected</h3>
              <p className="text-sm text-gray-500 mb-2">Follow me on social platforms:</p>
              <div className="flex gap-4">
                <a href="https://github.com/vinay637851" className="hover:text-white">GitHub</a>
                <a href="https://www.linkedin.com/in/vinaysharma637851/" className="hover:text-white">LinkedIn</a>
              </div>
            </div>
          </div>
          <hr className="my-6 border-gray-700" />
          <p className="text-center text-xs text-gray-500">@ Code Bit. Created by Vinay Sharma.</p>
        </div>
    </div>
    
  )
}

function Container({icon:Icon,title,description}){
  return(
    <div className="bg-gray-900 flex flex-col gap-3  text-white p-5 rounded-2xl hover:outline-1 hover:outline-blue-600">
      {Icon?<Icon className="text-indigo-500" size={30} />:null}
      <h1 className="text-xl font-semibold">{title}</h1>
      <p className="text-gray-500 text-lg">{description}</p>
    </div>
  )
}

export default Home