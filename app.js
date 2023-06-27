const express = require("express");
const { getAllTopics, getApi } = require("./controllers/app.controllers");
const { handleServerErrors } = require("./errors");

const app = express();

app.get("/api", getApi);

app.get("/api/topics", getAllTopics);

app.all("*", (_, res) => {
	res.status(404).send({ msg: "Not found" });
});

app.use(handleServerErrors);

module.exports = app;
