// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCKB5HpoWBq3pn6kfXQ9Hgi4KNI7IBHpFE',
  authDomain: 'macabeadasdev.firebaseapp.com',
  projectId: 'macabeadasdev',
  storageBucket: 'macabeadasdev.firebasestorage.app',
  messagingSenderId: '992461612652',
  appId: '1:992461612652:web:40f46308473ee540f49a49',
  measurementId: 'G-N247DG9LDK',
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const analytics = getAnalytics(firebaseApp);
export const googleAuthProvider = new GoogleAuthProvider();
