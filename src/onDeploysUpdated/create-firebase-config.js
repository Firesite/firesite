import { promises as fs } from "fs";

const createFirebaseConfig = async (projectId, siteName, siteId, tmpdir) => {
	console.log("Moving static directory");
	await fs.rename(`${tmpdir}/functions/static`, `${tmpdir}/static`);
	console.log("Creating firebase.json");
	const json = {
		hosting: {
			target: siteId,
			public: "static",
			rewrites: [
				{
					source: "**",
					function: siteId
				}
			]
		}
	};
	await fs.writeFile(
		`${tmpdir}/firebase.json`,
		JSON.stringify(json, null, 2)
	);
	const firebaserc = {
		targets: {
			[projectId]: {
				hosting: {
					[siteId]: [siteName]
				}
			}
		}
	};
	console.log(JSON.stringify(firebaserc, null, 2));
	return fs.writeFile(
		`${tmpdir}/.firebaserc`,
		JSON.stringify(firebaserc, null, 2)
	);
};

export default createFirebaseConfig;
