import { credential } from "firebase-admin";
import { initializeApp, getApps } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database"

/**
 * get old instance
 */
var firebaseOldInstances = getApps()

var firebaseAdmin = null
if (firebaseOldInstances.length > 0) {
    firebaseAdmin = firebaseOldInstances[0]
} else {
    var serviceAccount = require("./service-key.json");
    firebaseAdmin = initializeApp({
        credential: credential.cert(serviceAccount),
        databaseURL: "https://intvuthea-41f83.firebaseio.com",
    });
}

export const TODO_DB = getDatabase(firebaseAdmin).ref('todos')
