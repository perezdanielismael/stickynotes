import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {
        apiKey: "AIzaSyBLkUW1w5R7Ga0D6pZJj8cQM-PP_I1P9JQ",
        authDomain: "crud-basico-c5303.firebaseapp.com",
        projectId: "crud-basico-c5303",
        storageBucket: "crud-basico-c5303.appspot.com",
        messagingSenderId: "228033179401",
        appId: "1:228033179401:web:f340b75db2025f1ea52dd8"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  const db = firebase.firestore()
  const auth = firebase.auth()

  export {db, auth}