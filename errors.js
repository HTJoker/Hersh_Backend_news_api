exports.handleServerError = (err, req, res, next) => {
	console.log(err);
	res.status(500).send({ msg: "Server Error!" });
};
