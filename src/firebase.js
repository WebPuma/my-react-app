import { initializeApp } from "firebase/app";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID
};

const app = initializeApp(firebaseConfig);

const shouldUseEmulators = String(process.env.REACT_APP_USE_FIREBASE_EMULATORS).toLowerCase() === "true";

const functions = getFunctions(app);

if (shouldUseEmulators) {
  // Route callable/HTTP functions through the local emulator when running the suite.
  connectFunctionsEmulator(functions, "localhost", 5001);
  console.info("Firebase functions emulator enabled (localhost:5001)");
}

export { app, functions };
