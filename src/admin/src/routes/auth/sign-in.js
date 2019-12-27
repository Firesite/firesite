import admin from "../../firebaseAdmin";

const dev = process.env.NODE_ENV === "development";
console.log("dev", dev);

export const post = (req, res, next) => {
	console.log("__session", req.cookies.__session);
	
	const idToken = req.body.idToken.toString();
	const csrfToken = req.body.csrfToken.toString();

	// We need tp store the csrf token in the __session cookie, since Firebase hosting
	// only allows one cookie named __session.

	if (csrfToken !== req.cookies.__session) {
		res.status(401).send("UNAUTHORIZED REQUEST!");
		return;
	}

	const expiresIn = 60 * 60 * 24 * 5 * 1000;
	admin
		.auth()
		.createSessionCookie(idToken, { expiresIn })
		.then(
			sessionCookie => {
				const options = { maxAge: expiresIn, httpOnly: true, secure: !dev };
				res.cookie("__session", sessionCookie, options);
				res.end(JSON.stringify({ status: "success" }));
			},
			error => {
				console.error(error);
				res.status(401).send("UNAUTHORIZED REQUEST!");
			}
		);
};
