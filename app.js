const express = require("express");
const {
	getAllTopics,
	getApi,
	getArticleById,
	getAllArticles,
	getCommentsById,
	postCommentById,
} = require("./controllers/app.controllers");
const {
	handleServerError,
	handlepsqlError,
	handleCustomError,
} = require("./errors");

const app = express();
app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getAllTopics);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsById);

app.post("/api/articles/:article_id/comments", postCommentById);

app.use(handlepsqlError);

app.use(handleCustomError);

app.use(handleServerError);
module.exports = app;
