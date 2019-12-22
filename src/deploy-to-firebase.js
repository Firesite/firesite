import * as functions from "firebase-functions";
import * as firebaseClient from "firebase-tools";

const deployToFirebase = async functionsDirectory => {
	const { projectId } = JSON.parse(process.env.FIREBASE_CONFIG);
	console.log(`deploying to project ${projectId} from ${functionsDirectory}`);
	const firebaseToken = functions.config().fb.token || null;
	if (!firebaseToken) {
		console.error(
			"No firebase token found. Please add your Firebase token to your functions config under fb.token"
		);
		return;
	}

	const cwd = process.cwd();
	try {
		process.chdir(functionsDirectory);
		await firebaseClient.deploy({
			project: projectId,
			only: "hosting,functions",
			token: firebaseToken,
			force: true
		});
		process.chdir(cwd);
	} catch (err) {
		console.log("cwd", process.cwd());
		process.chdir(cwd);
		throw err;
	}
};

export default deployToFirebase;
