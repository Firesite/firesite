import { promises as fs } from "fs";

const updateSite = async (deployDocument, functionsDirectory, functionName) => {
	console.log("updating files");
	const routesArray = Object.entries(deployDocument.routes || []);
	for (const [key, value] of routesArray) {
		if (value.type === "file") {
			const fileName = `${functionsDirectory}/src/routes/${key}`;
			await fs.writeFile(fileName, value.content);
		}
	}
	console.log("updating function name");
	const indexFileName = `${functionsDirectory}/index.js`;
	let indexJs = await fs.readFile(indexFileName, "utf-8");
	indexJs = indexJs.replace(/__name__/, functionName);
	console.log(indexJs);

	return fs.writeFile(indexFileName, indexJs);
};

export default updateSite;
