import os from "os";
import updateSite from "./update-site";
import runCommand from "./run-command";
import * as functions from "firebase-functions";
import downloadTemplate from "./download-template";
import deployToFirebase from "./deploy-to-firebase";
import createFirebaseJson from "./create-firebase-json";

exports.onDeploysUpdated = functions
	.runWith({ memory: "2GB", timeoutSeconds: 540 })
	.firestore.document("sites/{siteId}/deploys/{deployId}")
	.onWrite(async (change, context) => {
		const document = change.after.exists ? change.after.data() : null;
		if (!document || !document.status > 1) return false;
		const functionsDirectory = `${os.tmpdir()}/functions`;
		await downloadTemplate(functionsDirectory);
		await updateSite(document, functionsDirectory);
		await runCommand("npm install", functionsDirectory);
		await runCommand("npm run build", functionsDirectory);
		await createFirebaseJson(os.tmpdir());
		await deployToFirebase(functionsDirectory);
		return true;
	});
