const express = require("express");
const {
	getAllTopics,
	getAllEndpoints,
} = require("./controllers/app.controllers");

const app = express();

app.get("/api/topics", getAllTopics);

app.get("/api", getAllEndpoints);

app.use((err, req, res, next) => {
	if (err.msg) res.status(err.status).send({ msg: err.msg });
	else next(err);
});

app.use((err, req, res, next) => {
	console.log(err);
	res.status(500).send({ msg: "Server Error!" });
});

module.exports = app;
