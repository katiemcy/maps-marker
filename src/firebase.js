// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBEKkZkpoRWROpMy4whAZMOvsG4yHovjM4",
  authDomain: "maps-marker-b422d.firebaseapp.com",
  projectId: "maps-marker-b422d",
  storageBucket: "maps-marker-b422d.appspot.com",
  messagingSenderId: "193002443114",
  appId: "1:193002443114:web:73a4edfe9db2d3c4d3d513",
  databaseURL: "https://maps-marker-b422d-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);

export default firebase