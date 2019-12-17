const os = require("os");
const functions = require("firebase-functions");
const updateSite = require("./update-site");
const runCommand = require("./run-command");
const downloadTemplate = require("./download-template");
const deployToFirebase = require("./deploy-to-firebase");

exports.onDeploysUpdated = functions
	.runWith({ memory: "2GB", timeoutSeconds: 540 })
	.firestore.document("sites/{siteId}/deploys/{deployId}")
	.onWrite(async (change, context) => {
		const document = change.after.exists ? change.after.data() : null;
		if (!document || !document.status > 1) return false;
		const functionsDirectory = `${os.tmpdir}/functions`;
		await downloadTemplate(functionsDirectory);
    await updateSite(document, functionsDirectory);
    await runCommand("npm install", functionsDirectory);
    await runCommand("npm build", functionsDirectory);
    await deployToFirebase(functionsDirectory);
		return true;
	});
