const express = require("express");
const { getAllTopics, getApi } = require("./controllers/app.controllers");

const app = express();

app.get("/api", getApi);

app.get("/api/topics", getAllTopics);


module.exports = app;
