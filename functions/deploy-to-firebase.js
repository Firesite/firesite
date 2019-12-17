const functions = require("firebase-functions");
const firebaseClient = require("firebase-tools");

const deployToFirebase = functionsDirectory => {
	console.log("starting deploy");
	const firebaseToken = functions.config().fb.token || null;
	if (!firebaseToken) {
		console.error(
			"No firebase token found. Please add your Firebase token to your functions config under fb.token"
		);
		return;
	}
	return firebaseClient.deploy({
		token: firebaseToken,
		force: true,
		cwd: functionsDirectory
	});
};

exports.deployToFirebase = deployToFirebase;
