// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "welcomehome-f8d41.firebaseapp.com",
  projectId: "welcomehome-f8d41",
  storageBucket: "welcomehome-f8d41.appspot.com",
  messagingSenderId: "178884769557",
  appId: "1:178884769557:web:c04f0630dcbb9e532c1b1c"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);