
  //export default db;

  import firebase from 'firebase/compat/app';
  import 'firebase/compat/auth';
  import 'firebase/compat/firestore';
  import 'firebase/compat/storage';

  const firebaseConfig = {
    apiKey: "AIzaSyCHTqYK1-sEnRQIoipeHi3n80xrhxao2_4",
    authDomain: "instagram-react-75d47.firebaseapp.com",
    projectId: "instagram-react-75d47",
    storageBucket: "instagram-react-75d47.appspot.com",
    messagingSenderId: "952368122386",
    appId: "1:952368122386:web:ec57bbb061d9d7cc24e6cb",
    measurementId: "G-XG6B8X89DE"
  };

// Use this to initialize the firebase App
const firebaseApp = firebase.initializeApp(firebaseConfig);



// Use these for db & auth
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { auth, db, storage };