// Import the functions you need from the SDKs you need

import { getAnalytics } from "firebase/analytics";

import { initializeApp, getApp, getApps } from "firebase/app";
import { initializeAuth, getAuth } from "firebase/auth";
import { getReactNativePersistence } from "firebase/auth/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDTSmlguHVv-T1ErRVixtcnuT6neIl6Ins",
  authDomain: "trackbite-576d2.firebaseapp.com",
  projectId: "trackbite-576d2",
  storageBucket: "trackbite-576d2.firebasestorage.app",
  messagingSenderId: "879677418714",
  appId: "1:879677418714:web:447c704d3017a552f649e3",
  measurementId: "G-DJLTS1F99V"
};


// Prevent duplicate init during Fast Refresh
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const analytics = getAnalytics(app);

let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence (AsyncStorage),
  });
} catch {
  auth = getAuth(app);
}

export { auth };

export const db = getFirestore(app);
export const storage = getStorage(app);