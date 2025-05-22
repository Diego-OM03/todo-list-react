// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCypJIVJ6XIYyn4mmty5P5nN9-I0L1JaEA",
  authDomain: "todo-list-do.firebaseapp.com",
  projectId: "todo-list-do",
  storageBucket: "todo-list-do.appspot.com",
  messagingSenderId: "335692575550",
  appId: "1:335692575550:web:9f97011736c8586470326f",
  measurementId: "G-1645ZF7R2G"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const messaging = getMessaging(app);

export { db, messaging };



