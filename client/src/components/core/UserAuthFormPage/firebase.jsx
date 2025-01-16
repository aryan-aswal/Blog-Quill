
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
const firebaseConfig = {
  apiKey: "AIzaSyDanIcVhF2NNBi9-UzUy72FgYXDEGFvmwc",
  authDomain: "blog-website-45.firebaseapp.com",
  projectId: "blog-website-45",
  storageBucket: "blog-website-45.appspot.com",
  messagingSenderId: "661351178251",
  appId: "1:661351178251:web:3204214fc34e6e983fe70e",
  measurementId: "G-GZER7C7GLD"
};

const app = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider()
const auth = getAuth();

export const authWithGoogle = async() => {
  let user = null;
  await signInWithPopup(auth, provider)
  .then((result) => {
    user = result.user;
  })
  .catch((err) => {
    console.log(err);
  })

  return user;
}