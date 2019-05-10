import firebase from "firebase";

var firebaseConfig = {
    apiKey: "AIzaSyD8ReikYNIQfJrqif-htHS99owbqHCOtq4",
    authDomain: "compelling-muse-239621.firebaseapp.com",
    databaseURL: "https://compelling-muse-239621.firebaseio.com",
    projectId: "compelling-muse-239621",
    storageBucket: "compelling-muse-239621.appspot.com",
    messagingSenderId: "419719962101",
    appId: "1:419719962101:web:044be53a37cd5fd8"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase;