const fsPromises = require("fs").promises;

const updateSite = async (deployDocument, functionsDirectory) => {
  console.log("updating files");
  const routesArray = Object.entries(deployDocument.routes || []);
  for ([key, value] of routesArray) {
    if (value.type === "file") {
      const fileName = `${functionsDirectory}/src/routes/${key}`;
      await fsPromises.writeFile(fileName, value.content);
    }
  }
}

exports.updateSite = updateSite;