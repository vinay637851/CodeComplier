
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";


const firebaseConfig = {
  apiKey: "AIzaSyBaQsjd_YPvCs-pHGEarw_xLi_KPX_GKzk",
  authDomain: "code-editor-fe3c3.firebaseapp.com",
  projectId: "code-editor-fe3c3",
  storageBucket: "code-editor-fe3c3.appspot.com",
  messagingSenderId: "647863598373",
  appId: "1:647863598373:web:c0f0bb3a0f00b335ec2ecc",
  measurementId: "G-RC5EQ05N1J",
  databaseURL: "https://code-editor-fe3c3-default-rtdb.firebaseio.com/"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); 
export const database = getDatabase(app);

