import sirv from "sirv";
import polka from "polka";
import express from "express";
import compression from "compression";
import * as sapper from "@sapper/server";

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === "development";

const expressServer = express() // You can also use Express
	.use(compression({ threshold: 0 }), sapper.middleware());

if (dev) {
	expressServer.use(sirv("static", { dev })).listen(PORT, err => {
		if (err) console.log("error", err);
	});
}

export { expressServer };