import firebase from "firebase/app";
import "firebase/firestore";

// Initialize Cloud Firestore through Firebase
firebase.initializeApp({
  apiKey: "AIzaSyCgFc1BEv0svxW9pX6C_PtVz2qj1qnBf_0",
  authDomain: "messages-bde51.firebaseapp.com",
  databaseURL: "https://messages-bde51.firebaseio.com",
  projectId: "messages-bde51",
  storageBucket: "messages-bde51.appspot.com",
  messagingSenderId: "509289467296",
  appId: "1:509289467296:web:409f00d817870ef201a8c5",
  measurementId: "G-35P2C7G155"
});

export default firebase.firestore();
