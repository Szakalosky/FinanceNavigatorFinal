// Import the functions you need from the SDKs you need
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyB4Q9HOUXmkLYXJfkq7C7zK5Y6vq6cAkeo',
  authDomain: 'financenavigatorapp.firebaseapp.com',
  projectId: 'financenavigatorapp',
  storageBucket: 'financenavigatorapp.appspot.com',
  messagingSenderId: '333948556331',
  appId: '1:333948556331:web:c4727d824b7fdba625066e',
};

//Works
// Initialize Firebase

const app = firebase.initializeApp(firebaseConfig);

//Initialize Firestore
export const db = firebase.firestore(app);
export const FirebaseAuth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
