const express = require("express");
const {
	getAllTopics,
	getApi,
	getArticleById,
  getAllArticles,
} = require("./controllers/app.controllers");
const {
	handleServerError,
	handlepsqlError,
	handleCustomError,
} = require("./errors");

const app = express();

app.get("/api", getApi);

app.get("/api/topics", getAllTopics);

app.get("/api/articles", getAllArticles)

app.get("/api/articles/:article_id", getArticleById);

app.use(handlepsqlError);

app.use(handleCustomError);

app.use(handleServerError);
module.exports = app;
