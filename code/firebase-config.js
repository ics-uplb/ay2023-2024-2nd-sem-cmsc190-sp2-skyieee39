import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCs3aSQRzvVKQpdKAFAIye9YeSZAf8LwcQ",
  authDomain: "uplbmuni-ea4e0.firebaseapp.com",
  databaseURL: "https://uplbmuni-ea4e0-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "uplbmuni-ea4e0",
  storageBucket: "uplbmuni-ea4e0.appspot.com",
  messagingSenderId: "261567700509",
  appId: "1:261567700509:web:d5b6d6f15bd909c98030f4",
  measurementId: "G-2SNZM2G33M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
// Initialize Firebase Auth
const auth = getAuth(app);


export { db, auth };