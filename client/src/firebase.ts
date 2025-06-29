import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBLZ46AonJ8SzMzljTH9MVoIYNpSwROsRk",
  authDomain: "turtletrader-295e8.firebaseapp.com",
  projectId: "turtletrader-295e8",
  storageBucket: "turtletrader-295e8.firebasestorage.app",
  messagingSenderId: "1070046892622",
  appId: "1:1070046892622:web:defd397e1c90b14d03691f"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
