export const post = (req, res, next) => {
	res.clearCookie("__session");
	res.end(JSON.stringify({ status: "signed out" }));
};
