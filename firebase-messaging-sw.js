// public/firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/10.11.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.11.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCypJIVJ6XIYyn4mmty5P5nN9-I0L1JaEA",
  authDomain: "todo-list-do.firebaseapp.com",
  projectId: "todo-list-do",
  storageBucket: "todo-list-do.appspot.com",
  messagingSenderId: "335692575550",
  appId: "1:335692575550:web:9f97011736c8586470326f",
  measurementId: "G-1645ZF7R2G"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log("Recibido en segundo plano:", payload);
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/logo192.png"
  });
});

