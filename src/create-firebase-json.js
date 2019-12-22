const fsPromises = require("fs").promises;

const createFirebaseJson = async tmpdir => {
	console.log("Moving public directory");
	await fsPromises.rename(`${tmpdir}/functions/static`, `${tmpdir}/public`);
	console.log("Creating firebase.json");
	const json = {
		hosting: {
			public: "public",
			rewrites: [
				{
					source: "**",
					function: "ssr"
				}
			]
		}
	};
	return fsPromises.writeFile(
		`${tmpdir}/firebase.json`,
		JSON.stringify(json, null, 2)
	);
};

export default createFirebaseJson;
