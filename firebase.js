// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC1osU63fcCN2gyiKos7Zipeh1GYtWtQXM",
  authDomain: "library-cfd6a.firebaseapp.com",
  projectId: "library-cfd6a",
  storageBucket: "library-cfd6a.appspot.com",
  messagingSenderId: "131750361459",
  appId: "1:131750361459:web:5c39dd1063fafd1a65ad06"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };