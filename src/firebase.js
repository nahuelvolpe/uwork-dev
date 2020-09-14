import firebase from 'firebase';

const fire = firebase.initializeApp({
    apiKey: "AIzaSyAJ__Tii9Bf3BPN5jYsmYmrkE8wklyHU3w",
    authDomain: "uwork-dev-beta.firebaseapp.com",
    databaseURL: "https://uwork-dev-beta.firebaseio.com",
    projectId: "uwork-dev-beta",
    storageBucket: "uwork-dev-beta.appspot.com",
    messagingSenderId: "470754855452",
    appId: "1:470754855452:web:244265c2055fd1820badd9",
    measurementId: "G-NF0YDYHEFC"
});

export default fire;

/* const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firease.storage(); */
