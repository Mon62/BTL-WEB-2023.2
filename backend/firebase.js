import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import config from "./config.js";
import  admin  from "firebase-admin";
import serviceAccount from "./serviceAccountKey.json" assert {type: 'json'}

const app = initializeApp(config.firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

admin.initializeApp({credential: admin.credential.cert(serviceAccount)})

export { db, auth, storage, admin };


