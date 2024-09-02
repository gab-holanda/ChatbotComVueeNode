// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import dotenv from 'dotenv';
dotenv.config();

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.apiKeyenv,
  authDomain: process.env.authDomainenv,
  projectId: process.env.projectIdenv,
  storageBucket: process.env.storageBucketenv,
  messagingSenderId: process.env.messagingSenderIdenv,
  appId: process.env.appIdenv,
  measurementId: process.env.measurementIdenv
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

