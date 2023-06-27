const express = require("express");
const { getAllTopics } = require("./controllers/app.controllers");
const { handleServerError } = require("./errors");

const app = express();

app.get("/api/topics", getAllTopics);

app.use(handleServerError);
module.exports = app;
