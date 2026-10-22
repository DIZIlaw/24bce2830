import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBUn8qj5BcmK8VLy-i9q9bO5QAn57zDV6Y",
  authDomain: "aditya-49b17.firebaseapp.com",
  projectId: "aditya-49b17",
  storageBucket: "aditya-49b17.firebasestorage.app",
  messagingSenderId: "564116404138",
  appId: "1:564116404138:web:91c140b98ab0246c681dd3",
  measurementId: "G-ZVXWJM6QL2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
