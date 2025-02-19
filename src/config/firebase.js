// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth"; // Importa auth

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
const auth = getAuth(app); // Inicializa auth
const provider = new GoogleAuthProvider(); // Crea el proveedor de Google

export { db, auth, provider, signInWithPopup }; // Exporta auth y provider

