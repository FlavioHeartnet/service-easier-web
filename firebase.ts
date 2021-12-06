// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import router from "next/router";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBRZWp75q860y1KJ32HaqTgJ4eeyl11v0A",
  authDomain: "service-easier.firebaseapp.com",
  projectId: "service-easier",
  storageBucket: "service-easier.appspot.com",
  messagingSenderId: "786858898622",
  appId: "1:786858898622:web:4e67f46c86c06835981aef",
  measurementId: "G-TGMQ6HE1EQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const GoogleProvider = new GoogleAuthProvider();
export const auth = getAuth(app)
export const analytics = getAnalytics(app);
export const db = getFirestore(app)

export default app