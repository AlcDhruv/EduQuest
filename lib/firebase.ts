import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBDVhDutJVa1ya-4dU16lLm9TToK03qYPI",
  authDomain: "eduquest-dc68d.firebaseapp.com",
  projectId: "eduquest-dc68d",
  storageBucket: "eduquest-dc68d.firebasestorage.app",
  messagingSenderId: "903240920727",
  appId: "1:903240920727:web:43dd9ba527ae98675c43d2",
  measurementId: "G-5Z51TL5R1V"
};

// Initialize Firebase only if it hasn't been initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };