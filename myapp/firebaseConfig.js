import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCje7cWG61n7GUUsvIMRVCmtJIrqpenFsI",
  authDomain: "cosc4353-35f65.firebaseapp.com",
  projectId: "cosc4353-35f65",
  storageBucket: "cosc4353-35f65.appspot.com",
  messagingSenderId: "896996102587",
  appId: "1:896996102587:web:eea9de17b4f5d7acc6f49e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

var admin = require("firebase-admin");

var serviceAccount = require("./cosc4353-35f65-firebase-adminsdk-5u4y6-655663d6f4.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
