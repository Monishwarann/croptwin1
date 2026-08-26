import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyA9izutZWkFVPRTpIPES_IA-yS419DKwsA",
  authDomain: "dog7-8ca5d.firebaseapp.com",
  projectId: "dog7-8ca5d",
  storageBucket: "dog7-8ca5d.firebasestorage.app",
  messagingSenderId: "12112664078",
  appId: "1:12112664078:web:b6cc37195c1aed3e464e5f",
  measurementId: "G-8737D0RSPW"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Auth & Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Analytics if supported in environment
let analytics = null;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
}).catch(() => {});

export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  analytics
};

export default app;
