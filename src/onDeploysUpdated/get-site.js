import * as admin from "firebase-admin";

const getSite = async siteId => {
	const doc = await admin
		.firestore()
		.collection("sites")
		.doc(siteId)
    .get();
    
	return doc.exists ? doc.data() : {};
};

export default getSite;
