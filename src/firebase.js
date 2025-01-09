// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBubAQpMz4pJO7XAo6RhZheDQi8iZ2tsgs",
  authDomain: "app-ada.firebaseapp.com",
  projectId: "app-ada",
  storageBucket: "app-ada.firebasestorage.app",
  messagingSenderId: "386875800345",
  appId: "1:386875800345:web:4eaa2cfbdd3cebf3bae388",
  measurementId: "G-4VXLHYXQJV"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db }; // Exporta la variable db

