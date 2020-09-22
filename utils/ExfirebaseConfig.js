import firebase from "firebase";
try {
  if (!firebase.apps.length) {
    firebase.initializeApp({
      apiKey: "",
      authDomain: "",
      databaseURL: "",
      projectId: "",
      storageBucket: "",
      messagingSenderId: "",
      appId: "",
      measurementId: ""
    });
  }
} catch (err) {
  console.log(err);
}
const firebaseApp = firebase;

export default firebaseApp;
