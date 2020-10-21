import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyDfntuEFqK4iTDG_bRDORqWTRUSLzF7RkI",
  authDomain: "cess-86892.firebaseapp.com",
  databaseURL: "https://cess-86892.firebaseio.com",
  projectId: "cess-86892",
  storageBucket: "cess-86892.appspot.com",
  messagingSenderId: "920659785283",
  appId: "1:920659785283:web:f7c95ff03533f27c8c86f6",
  measurementId: "G-2RB85QB1R8"
};

const firebaseApp=firebase.initializeApp(firebaseConfig);
const db =firebaseApp.firestore();  
const auth=firebaseApp.auth();
const provider=new firebase.auth.GoogleAuthProvider();

export {auth,provider};
export default db;