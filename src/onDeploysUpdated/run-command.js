import { exec } from "promisify-child-process";

const runCommand = async (command, directory) => {
	console.log(`running ${command} in ${directory}`);
	let output;
	try {
		output = await exec(command, { cwd: directory });
	} catch (err) {
		console.log(`An error ocurred while running ${command}`);
		console.log(JSON.stringify(err));
		throw new Error(`error while running command ${command}`);
	}
	console.log(output.stdout);
	return true;
};

export default runCommand;
