// src/firebase.js
import firebase from "firebase/compat/app";
import 'firebase/compat/firestore';
import 'firebase/compat/storage'; // Import Firebase Storage

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId:process.env.REACT_APP_FIREBASE_PROJECT_ID ,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId:process.env.REACT_APP_FIREBASE_APP_ID
};

const app = firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore(app);
export const storage = firebase.storage(app); // Initialize and export Firebase Storage
