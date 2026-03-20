// Import the functions you need from the SDKs you need
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: Config.FIREBASE_API_KEY,
  authDomain: Config.FIREBASE_AUTH_DOMAIN,
  projectId: Config.FIREBASE_PROJECT_ID,
  storageBucket: Config.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: Config.FIREBASE_MESSAGING_SENDER_ID,
  appId: Config.FIREBASE_APP_ID,
};

//Works
// Initialize Firebase

const app = firebase.initializeApp(firebaseConfig);

//Initialize Firestore
export const db = firebase.firestore(app);
export const FirebaseAuth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
