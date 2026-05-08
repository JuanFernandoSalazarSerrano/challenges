import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAgtkKar3n-OxuEzDGIB0AHaZDUSDdL-sI",
  authDomain: "challenges-fernando.firebaseapp.com",
  databaseURL: "https://challenges-fernando-default-rtdb.firebaseio.com",
  projectId: "challenges-fernando",
  storageBucket: "challenges-fernando.firebasestorage.app",
  messagingSenderId: "690998630886",
  appId: "1:690998630886:web:3b8159c3ba8ebd0517de27",
  measurementId: "G-LN8YG3ZD7Q"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);

export default app;
