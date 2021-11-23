const firebase_admin = require("firebase-admin");
const firebase = require("firebase/app");
const firebaseauth = require("firebase/auth");
const serviceAccount = require("./dobby-eba4c-firebase-adminsdk-voed8-afd1eeb458.json");

const firebaseConfig = {
  apiKey: "AIzaSyDqARHqN5dQAk_JKYCvRlO6O7VyWzZQb0w",
  authDomain: "dobby-eba4c.firebaseapp.com",
  projectId: "dobby-eba4c",
  storageBucket: "dobby-eba4c.appspot.co",
  messagingSenderId: "185760420823",
  appId: "1:185760420823:web:8fa5c8b47f5c1dbbcfb192",
  measurementId: "G-VEVJDN7LYX",
};

firebase.initializeApp(firebaseConfig);
firebase_admin.initializeApp(
  { credential: firebase_admin.credential.cert(serviceAccount) },
  process.env.databaseURL,
  process.env.storageBucket
);

const admin = firebase_admin.firestore();
const adminauth = firebase_admin.auth();
const auth = firebaseauth.getAuth();

admin.settings({ ignoreUndefinedProperties: true });
module.exports = { admin, adminauth, auth, firebase_admin };
