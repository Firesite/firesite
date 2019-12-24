import degit from "degit";

const downloadTemplate = targetDirectory => {
	const emitter = degit("Firesite/firesite-template", { force: true });
	emitter.on("info", info => console.log(info.message));
	return emitter.clone(targetDirectory);
};

export default downloadTemplate;
