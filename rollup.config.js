import generatePackageJson from "rollup-plugin-generate-package-json";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import { builtinModules } from "module";
import json from "@rollup/plugin-json";
import pkg from "./package.json";

export default [
	{
		input: "./src/index.js",
		output: {
			file: "./functions/index.js",
			format: "cjs"
		},
		plugins: [
			resolve({
				preferBuiltins: true
			}),
			commonjs({
				include: [/node_modules/, /.*__sapper__.*/],
				namedExports: {
					"node_modules/firebase-tools/lib/index.js": ["deploy"],
					"node_modules/firebase-functions/lib/index.js": ["config", "runWith"]
				}
			}),
			json(),
			terser({
				exclude: /package\.json/
			}),
			generatePackageJson({
				baseContents: pkg => ({
					name: `${pkg.name}-functions`,
					engines: {
						node: "10"
					},
					scripts: {
						test: "mocha --reporter spec"
					},
					dependencies: {},
					private: true
				}),
				additionalDependencies: pkg.dependencies
			})
		],
		external: [
			...Object.keys(pkg.dependencies),
			...Object.keys(process.binding("natives")),
			...builtinModules
		]
	},
	{
		input: "./src/test/index.test.js",
		output: {
			file: "./functions/test/index.test.js",
			format: "cjs"
		},
		external: [
			...Object.keys(pkg.dependencies),
			...Object.keys(process.binding("natives")),
			...builtinModules
		]
	}
];
