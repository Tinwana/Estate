import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";
import { getAuth, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
export const firebaseConfig = {
  apiKey: "AIzaSyBvWD7e4VEGSe0UhDQzZaWie8-_POEkTJk",
  authDomain: "auth-a247d.firebaseapp.com",
  projectId: "auth-a247d",
  storageBucket: "auth-a247d.appspot.com",
  messagingSenderId: "600287096039",
  appId: "1:600287096039:web:804e7e7f342955bab8c642",
  measurementId: "G-QWT8PQ0NPL",
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);

// rules_version = '2';

// service cloud.firestore {
//   match /databases/{database}/documents {
//     match /{document=**} {
//       allow read, write: if false;
//     }
//   }
// }
