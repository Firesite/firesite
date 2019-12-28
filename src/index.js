import * as functions from "firebase-functions";

import onDeploysUpdated from "./onDeploysUpdated/index";
import expressServer from "./admin/index";

exports.onDeploysUpdated = functions
	.runWith({ memory: "2GB", timeoutSeconds: 540 })
	.firestore.document("sites/{siteId}/deploys/{deployId}")
	.onWrite(onDeploysUpdated);

exports.ssr = functions.https.onRequest(expressServer);
