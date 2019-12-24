import os from "os";
import getSite from "./get-site";
import updateSite from "./update-site";
import runCommand from "./run-command";
import downloadTemplate from "./download-template";
import deployToFirebase from "./deploy-to-firebase";
import createFirebaseConfig from "./create-firebase-config";

const onDeploysUpdated = async (change, context) => {
	const document = change.after.exists ? change.after.data() : null;
	if (!document || !document.status > 1) return false;

	const { projectId } = JSON.parse(process.env.FIREBASE_CONFIG);
	const siteId = context.params.siteId;
	const site = await getSite(siteId);
	const siteName = site.name;
	const functionId = `f${siteId}`;

	const functionsDirectory = `${os.tmpdir()}/functions`;
	await downloadTemplate(functionsDirectory);
	await updateSite(document, functionsDirectory, functionId);
	await runCommand("npm install", functionsDirectory);
	await runCommand("npm run build", functionsDirectory);
	await createFirebaseConfig(projectId, siteName, functionId, os.tmpdir());
	await deployToFirebase(projectId, functionId, functionsDirectory);
	return true;
}

export default onDeploysUpdated;

