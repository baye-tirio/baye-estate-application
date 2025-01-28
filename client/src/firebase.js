// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "baye-estate---mern.firebaseapp.com",
  projectId: "baye-estate---mern",
  storageBucket: "baye-estate---mern.firebasestorage.app",
  messagingSenderId: "738110229850",
  appId: "1:738110229850:web:008dfb7d1bb9a2db7d3763"
};

// Initialize Firebase
 export const app = initializeApp(firebaseConfig);