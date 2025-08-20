// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { initializeAuth, getReactNativePersistence, getAuth, Auth } from "firebase/auth";
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


// ✅ Prevent duplicate init (important for Fast Refresh & production)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

/// ✅ Guard against multiple auth initializations
// ✅ Initialize auth with persistence (AsyncStorage) only once
let auth: Auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (err) {
  // If it's already initialized (Fast Refresh in dev), fallback to getAuth
  auth = getAuth(app);
}
// ✅ Singletons for Firestore & Storage
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };