const admin = require("firebase-admin");

import serviceAccount from "../../../keys/service-account.json";

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://firesite-b4279.firebaseio.com"
});

export default admin;
