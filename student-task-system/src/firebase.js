import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
const firebaseConfig = {
apiKey: "AIzaSyAGTDnbe0Z5XxYCzEbD8Ng5ojyAvE41-Fk",
authDomain: "task-planner-aa0f2.firebaseapp.com",
projectId: "task-planner-aa0f2",
storageBucket: "task-planner-aa0f2.firebasestorage.app",
messagingSenderId: "161984886013",
appId: "1:161984886013:web:f280d6bc1e2ac2e284fa94"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(
app,
"asia-southeast2"
);