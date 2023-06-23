const firebase = require("firebase/compat/app");
require("dotenv").config();
require("firebase/database");
require("firebase/compat/firestore");

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MSG_SENDERID,
  appId: process.env.FIREBASE_APPID,
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

module.exports = { db };
