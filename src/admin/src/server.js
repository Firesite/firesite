import sirv from "sirv";
import express from "express";
import { json } from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import * as sapper from "@sapper/server";
import admin from "./firebaseAdmin";

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === "development";

const firebaseMiddleware = () => (req, res, next) => {
	const sessionCookie = req.cookies.__session || "";
	admin
		.auth()
		.verifySessionCookie(sessionCookie, true /** checkRevoked */)
		.then(decodedClaims => {
			res.user = { displayName: decodedClaims.name };
			next();
		})
		.catch(error => {
			next();
		});
};

const expressServer = express() // You can also use Express
	.use(
		compression({ threshold: 0 }),
		sirv("static", { dev }),
		cookieParser(),
		json(),
		firebaseMiddleware(),
		sapper.middleware({
			session: (req, res) => ({
				user: res.user
			})
		})
	);

if (dev) {
	expressServer.listen(PORT, err => {
		if (err) console.log("error", err);
	});
}

export { expressServer };
