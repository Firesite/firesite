const admin = require("firebase-admin");
const rimraf = require("rimraf");
const os = require("os");
const { config } = require("../../config/runtimeconfig");
const test = require("firebase-functions-test")(
	config.fb.project,
	config.fb.jsonKeyPath
);
test.mockConfig(config);

const siteDeployedSnapshot = {
	routes: {
		"index.svelte": {
			type: "file",
			content: "<h1>Test</h1>"
		}
	},
	status: 1
};

describe("Cloud Functions", function() {
	this.timeout(0);
	let myFunctions;
	before(() => {
		myFunctions = require("../index.js");
	});

	after(() => {
		test.cleanup();
	});

	describe("Site Deployed", () => {
		it("should build and deploy the site when a deploy is made", async () => {
			await new Promise(resolve => rimraf(os.tmpdir(), resolve));
			const snapshotPath = "sites/{siteId}/deploys/{deployId}";
			const before = test.firestore.makeDocumentSnapshot({}, snapshotPath);
			const after = test.firestore.makeDocumentSnapshot(
				siteDeployedSnapshot,
				snapshotPath
			);
			const snap = { before, after };
			const wrapped = test.wrap(myFunctions.onDeploysUpdated);
			const result = await wrapped(snap);
			return result;
		});
	});
});
