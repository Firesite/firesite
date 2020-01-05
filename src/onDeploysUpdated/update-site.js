import { promises as fs } from "fs";

const checkIfExists = async path => {
	let exists = true;
	try {
		await fs.stat(path);
	} catch (err) {
		if (err.code === "ENOENT") exists = false;
	}
	return exists;
};

const createRoute = async (routes, current, path) => {
	const currentLevelRoutes = routes.filter(route => route.parent === current);
	path = current != "" ? `${path}/${current}` : path;
	for (const route of currentLevelRoutes) {
		if (current === "" && route.slug === "index") {
			await fs.writeFile(`${path}/index.svelte`, route.content);
		} else {
			const exists = await checkIfExists(`${path}/${route.slug}`);
			if (!exists) {
				await fs.mkdir(`${path}/${route.slug}`);
			}
			await fs.writeFile(`${path}/${route.slug}/index.svelte`, route.content);
		}
		await createRoute(routes, route.slug, path);
	}
};

const updateSite = async (deployDocument, functionsDirectory, functionName) => {
	const routesArray = deployDocument.routes;
	await createRoute(routesArray, "", `${functionsDirectory}/src/routes`);

	const routes = routesArray.filter(route => route.parent == "");

	let navItems = "";
	for (let { name, slug } of routes) {
		slug = slug === "index" ? "." : slug;
		navItems += `<li><a class:selected={segment === "${slug}"} rel="prefetch" href="${slug}">${name}</a></li>`;
	}
	console.log("updating nav component");
	const navComponentPath = `${functionsDirectory}/src/components/Nav.svelte`;
	let navComponentContent = await fs.readFile(navComponentPath, {
		encoding: "utf-8"
	});
	navComponentContent = navComponentContent.replace(
		/%firesite.navitems%/,
		navItems
	);
	await fs.writeFile(navComponentPath, navComponentContent);
	console.log("updating function name");
	const indexFileName = `${functionsDirectory}/index.js`;
	let indexJs = await fs.readFile(indexFileName, "utf-8");
	indexJs = indexJs.replace(/__name__/, functionName);
	console.log(indexJs);

	return fs.writeFile(indexFileName, indexJs);
};

export default updateSite;
