const fsPromises = require("fs").promises;

const updateSite = async (deployDocument, functionsDirectory) => {
	console.log("updating files");
	const routesArray = Object.entries(deployDocument.routes || []);
	for (const [key, value] of routesArray) {
		if (value.type === "file") {
			const fileName = `${functionsDirectory}/src/routes/${key}`;
			await fsPromises.writeFile(fileName, value.content);
		}
	}
};

export default updateSite;
