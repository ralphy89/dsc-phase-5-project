// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyByOcmo7ARVhc_H282ZxbqIAd4YMzVmZI0",
  authDomain: "sentimentshop.firebaseapp.com",
  projectId: "sentimentshop",
  storageBucket: "sentimentshop.firebasestorage.app",
  messagingSenderId: "911800519449",
  appId: "1:911800519449:web:f0833e3575827ec75b1388",
  measurementId: "G-7R0J0QHPV9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Analytics (optional)
export const analytics = getAnalytics(app);

export default app;