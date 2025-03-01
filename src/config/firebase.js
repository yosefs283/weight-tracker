import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBiqDoUajhxDxEG4o-SmmHWXSyQ6VSqVf8",
    authDomain: "weight-tracker-b2774.firebaseapp.com",
    projectId: "weight-tracker-b2774",
    storageBucket: "weight-tracker-b2774.firebasestorage.app",
    messagingSenderId: "636759293394",
    appId: "1:636759293394:web:b1a73de0c40fd72b585c0b",
    measurementId: "G-JRRZD3NKE1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); 