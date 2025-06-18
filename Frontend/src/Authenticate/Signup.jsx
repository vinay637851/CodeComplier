
import {ToastContainer, toast } from "react-toastify";
import { auth, database } from "./firebaseConfig";
import { ref, set, get, child } from "firebase/database";
import { X } from "lucide-react";
import { createUserWithEmailAndPassword, GoogleAuthProvider,getAuth, signInWithPopup,updateProfile } from "firebase/auth";
import { useNavigate ,Link} from "react-router-dom";


function Login() {
  const navigate = useNavigate();
  async function LoginData(e){
      e.preventDefault()
      let email=e.target.email.value;
      let password=e.target.password.value;
      if(e.target.password.value!=e.target.confirm_password.value)
        toast.error("Confirm password does not match !")
      else{
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
          console.log("User registered:", user);
          await updateProfile(user, { displayName: e.target.name.value });
            await set(ref(database, "users/" + user.uid), {
            uid: user.uid,
            name: e.target.name.value,
            email: user.email,
            profilePicture: user.photoURL || "profile.png"
          });
          toast.success("Signup successful!");
          setTimeout(() => navigate("/login"), 2000);
        } catch (error) {
          console.error("Signup error:", error.message);
          if (error.code === "auth/password-does-not-meet-requirements")
            toast.error("Password must include at least a lowercase letter, an uppercase letter, and a special character.");
          else if(error.code=="auth/weak-password")
            toast.error("Password must be at least 6 characters long.");
          else if(error.code=="auth/email-already-in-use")
            toast.error("Email already in use. Please use a different email.");
          else 
            toast.error(error.message);
        }
      }
  }
  async function GoogleAuth() {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const user = result.user;
        const snapshot = await get(child(ref(database ), "users/" + user.uid));
        if (!snapshot.exists()) {
          await set(ref(database , "users/" + user.uid), {
            uid: user.uid,
            name: user.displayName,
            email: user.email,
            profilePicture: user.photoURL || "profile.png"
          });
        }
        toast.success("Google signup successful!");
        setTimeout(() => navigate("/"), 2000);
      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.error("Google Auth error:", errorCode, errorMessage, email, credential);
      });
  }
  return (
    <div className="flex items-center justify-center h-screen bg-gray-800">
    <ToastContainer position="top-center" autoClose={2000} theme="dark" />
    <div className="bg-gray-900 text-white p-8 relative rounded-lg shadow-md w-96 text-center">
      <Link to="/"><X className="absolute right-1 top-1 text-gray-500 hover:rotate-90 cursor-pointer duration-100"/></Link>
      <h2 className="text-2xl font-bold mb-6">
        Create Account
      </h2>

      <form onSubmit={LoginData} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          className="w-full px-4 py-2 border rounded"
          required
        />
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
        <input
          type="password"
          name="confirm_password"
          placeholder="Confirm Password"
          className="w-full px-4 py-2 border rounded"
          required
        />
        <button
          className="w-full cursor-pointer bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Signup with Email
        </button>
      </form>

      <div className="my-4 text-gray-500">or</div>

      <button
        onClick={GoogleAuth}
        className="w-full cursor-pointer bg-red-500 text-white py-2 rounded mb-2 hover:bg-red-600 transition"
      >
        Signin with Google
      </button>

      <p className="mt-4 text-sm text-gray-600">
        Already have account? 
        <button className="text-blue-600 ml-2 underline">
          <Link to="/login">Login</Link>
        </button>
      </p>
    </div>
  </div>

  );
}

export default Login