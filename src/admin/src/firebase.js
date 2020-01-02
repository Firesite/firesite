import { firebaseConfig } from "./firebaseConfig";

export async function auth() {
	if (process.browser) {
		return window.auth;
	} else {
		const firebase = await import("firebase");
		if (firebase.apps.length == 0) {
			let app = firebase.initializeApp(firebaseConfig);
			return app.auth();
		} else {
			return firebase.apps[0].auth();
		}
	}
}

export async function firestore() {
	if (process.browser) {
		return window.db;
	} else {
		const firebase = await import("firebase");
		if (firebase.apps.length == 0) {
			let app = firebase.initializeApp(firebaseConfig);
			return app.firestore();
		} else {
			return firebase.apps[0].firestore();
		}
	}
}

export async function firestoreHelpers() {
	if (process.browser) {
		return {
			arrayUnion: firebase.firestore.FieldValue.arrayUnion,
			arrayRemove: firebase.firestore.FieldValue.arrayRemove
		};
	} else {
		const firebase = await import("firebase");
		return {
			arrayUnion: firebase.firestore.FieldValue.arrayUnion,
			arrayRemove: firebase.firestore.FieldValue.arrayRemove
		};
	}
}

export async function storage() {
	if (process.browser) {
		return window.storage;
	} else {
		return null;
	}
}
