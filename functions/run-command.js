const { exec } = require("promisify-child-process");

const runCommand = (command, directory) => {
	return exec(command, { cwd: directory });
};

exports.runCommand = runCommand;
