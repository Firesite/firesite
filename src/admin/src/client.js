import * as sapper from "@sapper/app";
import { firebaseConfig } from "./firebaseConfig";

const app = firebase.initializeApp(firebaseConfig);
window.auth = app.auth();
window.db = app.firestore();
window.storage = app.storage();

window.firestore = app.firestore;

sapper.start({
	target: document.querySelector("#sapper")
});
