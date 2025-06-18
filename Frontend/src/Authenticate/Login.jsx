import React from "react";
import {X} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import { auth,database } from "./firebaseConfig";
import { ref, child, get,set} from "firebase/database";
import { signInWithEmailAndPassword,GoogleAuthProvider,getAuth, signInWithPopup  } from "firebase/auth";
import { useNavigate ,Link} from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log(user)
      const snapshot = await get(child(ref(database), "users/" + user.uid));
      if (!snapshot.exists()) {
        toast.error("No user record found. Please sign up.");
        return;
      }

      toast.success("Login successful!");
      setTimeout(() => navigate("/"), 2000);
      
    } catch (error) {
      if(error.code=="auth/invalid-credential"){
        toast.error("Invalid credentials. Please try again.");
      } 
      else{
        toast.error("Login failed. Please check your credentials.");
      }
      
    }
  }
  async function GoogleAuth() {
      console.log("google")
      const provider = new GoogleAuthProvider();
      const auth = getAuth();
      signInWithPopup(auth, provider)
        .then(async (result) => {
          const user = result.user;
          const snapshot = await get(child(ref(database), "users/" + user.uid));
              if (!snapshot.exists()) {
                await set(ref(database, "users/" + user.uid), {
                  uid: user.uid,
                  name: user.displayName,
                  email: user.email,
                  profilePicture: user.photoURL || "profile.png",
                });
              }

          toast.success("Google login successful!");
          setTimeout(() => navigate("/"), 2000);
        }).catch((error) => {
          console.error("Google login error:", error);
          toast.error("Google login failed.");
        });
    }
  return (
    <div className="flex items-center justify-center h-screen bg-gray-800">
      <ToastContainer position="top-center" autoClose={2000} theme="dark" />
      <div className="bg-gray-900 text-white p-8 relative rounded-lg shadow-md w-96 text-center">
        <Link to="/"><X className="absolute right-1 top-1 text-gray-500 hover:rotate-90 cursor-pointer duration-100"/></Link>
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full cursor-pointer bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          >
            Login
          </button>
        </form>
         <div className="my-4 text-gray-500">or</div>

      <button
        onClick={GoogleAuth}
        className="w-full cursor-pointer bg-red-500 text-white py-2 rounded mb-2 hover:bg-red-600 transition"
      >
        Login with Google
      </button>
      <p className="mt-4 text-sm text-gray-600">
        Create an account ? 
        <button className="text-blue-600 ml-2 underline">
          <Link to="/signup">SignUp</Link>
        </button>
      </p>
      </div>
    </div>
  );
}

export default Login;
