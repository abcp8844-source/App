import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1. Secure Bridge Matrix: Environment variables mapped directly from the root .env file
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID
};

// 2. Mobile Engine Crash Prevention: Initialize Firebase App instance only if it is not already booted
let royalFirebaseApp;
if (getApps().length === 0) {
  royalFirebaseApp = initializeApp(firebaseConfig);
  console.log("[FirebaseConfig] Cloud server session securely linked via root .env configuration mapping!");
} else {
  royalFirebaseApp = getApp();
}

// 3. Persistent Storage Engine: Connects Firebase Authentication directly into the mobile's hardware memory
const royalFirebaseAuth = initializeAuth(royalFirebaseApp, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// 4. Authoritative Database Reference: Access node for Cloud NoSQL Firestore Streams
const royalCloudDatabase = getFirestore(royalFirebaseApp);

export { royalFirebaseApp, royalFirebaseAuth, royalCloudDatabase };
