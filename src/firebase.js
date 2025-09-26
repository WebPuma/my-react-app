// Debug: Log Firebase environment variables
console.log('REACT_APP_API_KEY:', process.env.REACT_APP_API_KEY);
console.log('REACT_APP_AUTH_DOMAIN:', process.env.REACT_APP_AUTH_DOMAIN);
console.log('REACT_APP_PROJECT_ID:', process.env.REACT_APP_PROJECT_ID);
console.log('REACT_APP_STORAGE_BUCKET:', process.env.REACT_APP_STORAGE_BUCKET);
console.log('REACT_APP_MESSAGING_SENDER_ID:', process.env.REACT_APP_MESSAGING_SENDER_ID);
console.log('REACT_APP_APP_ID:', process.env.REACT_APP_APP_ID);
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);