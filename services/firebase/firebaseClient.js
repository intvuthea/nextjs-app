import { getDatabase } from "firebase/database";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyBoCnfUW92YcxtkFiFJs90cSqt9WTW946o",
    authDomain: "intvuthea-41f83.firebaseapp.com",
    databaseURL: "https://intvuthea-41f83.firebaseio.com",
    projectId: "intvuthea-41f83",
    storageBucket: "intvuthea-41f83.appspot.com",
    messagingSenderId: "1085362887626",
    appId: "1:1085362887626:web:7dfd6c01bcb484daaecd33",
    measurementId: "G-RDT7DC8GLM"
};

export const firebaseClient = initializeApp(firebaseConfig);
export const firebaseClientDB = getDatabase(firebaseClient)

