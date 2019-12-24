import { exec } from "promisify-child-process";

const runCommand = async (command, directory) => {
	console.log(`running ${command} in ${directory}`);
	const { stdout, stderr } = await exec(command, { cwd: directory });
	console.log(`command completed, output: ${stdout} ${stderr}`);
	return true;
};

export default runCommand;
