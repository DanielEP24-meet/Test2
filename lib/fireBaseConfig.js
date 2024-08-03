import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyA7_5tTBM3MWG6F8casKP6mNLxEkxZBbho",
  authDomain: "hestiadb-fbba3.firebaseapp.com",
  databaseURL:
    "https://hestiadb-fbba3-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "hestiadb-fbba3",
  storageBucket: "hestiadb-fbba3.appspot.com",
  messagingSenderId: "979082184288",
  appId: "1:979082184288:web:bd33de71ab4bf7d0222505",
  measurementId: "G-0S4N9VQJSM",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { auth, database };
