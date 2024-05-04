// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCuJqAp4OYvcN8-e4RKmhxyUCUXqyW3pvY",
  authDomain: "inha-d8aa8.firebaseapp.com",
  projectId: "inha-d8aa8",
  storageBucket: "inha-d8aa8.appspot.com",
  messagingSenderId: "241633442549",
  appId: "1:241633442549:web:269f5056ecbd904d7be3bc",
  measurementId: "G-WT6Z86P8YZ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);